import os

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
from datetime import datetime
import numpy as np
import tensorflow as tf
import cv2
import base64
import io
import json


app = FastAPI(title="Plant Disease Classifier")


# -----------------------------------
# CORS
# -----------------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------
# MongoDB Connection
# -----------------------------------
client = MongoClient("mongodb://localhost:27017")
db = client["plant_disease_db"]
scans_collection = db["scans"]


# -----------------------------------
# Load Model
# -----------------------------------
model = load_model("model/plant_disease_cnn.h5")


# -----------------------------------
# Class Labels
# -----------------------------------
CLASS_NAMES = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy"
]

# -----------------------------------
# Disease Information
# -----------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "disease_info.json")

DISEASE_INFO = {}

try:
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        DISEASE_INFO = json.load(f)
    print("Disease info JSON loaded successfully")
except Exception as e:
    print("Failed to load disease_info.json:", e)

# -----------------------------------
# Helper Functions
# -----------------------------------
def read_image(file_bytes: bytes):
    """
    Read uploaded image bytes, convert to RGB, resize to 224x224,
    return numpy array for prediction and original PIL image for Grad-CAM overlay.
    """
    pil_img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    original_pil = pil_img.copy()
    resized_img = pil_img.resize((224, 224))

    img_array = np.array(resized_img, dtype=np.float32)
    return img_array, original_pil


def predict_image(img_array: np.ndarray):
    """
    Preprocess image and predict class/confidence.
    """
    input_tensor = np.expand_dims(img_array, axis=0)
    input_tensor = preprocess_input(input_tensor)

    preds = model.predict(input_tensor, verbose=0)
    class_idx = int(np.argmax(preds[0]))
    confidence = float(preds[0][class_idx])

    return CLASS_NAMES[class_idx], confidence


# -----------------------------------
# Grad-CAM Functions
# -----------------------------------
def make_gradcam_heatmap(img_array, model, last_conv_layer_name="Conv_1"):
    """
    Generate Grad-CAM heatmap from the last convolutional layer.
    """
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        pred_index = tf.argmax(predictions[0])
        loss = predictions[:, pred_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    max_val = tf.math.reduce_max(heatmap)
    if max_val == 0:
        return np.zeros_like(heatmap.numpy())

    heatmap = tf.maximum(heatmap, 0) / max_val
    return heatmap.numpy()


def gradcam_to_base64(pil_img, heatmap):
    """
    Overlay heatmap on original image and return base64 PNG string.
    """
    img_np = np.array(pil_img)

    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.resize(heatmap, (pil_img.width, pil_img.height))
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    overlay = np.uint8(0.4 * heatmap + 0.6 * img_np)

    overlay_pil = Image.fromarray(overlay)
    buffer = io.BytesIO()
    overlay_pil.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


# -----------------------------------
# Routes
# -----------------------------------
@app.get("/")
def root():
    return {"message": "Plant Disease Classifier API is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read uploaded file bytes
        file_bytes = await file.read()

        if not file_bytes:
            return JSONResponse(
                status_code=400,
                content={"error": "Empty file uploaded"}
            )

        # Read and preprocess image
        img_array, original_pil = read_image(file_bytes)

        # Predict
        label, confidence = predict_image(img_array)

        # Get disease information from JSON
        disease_info = DISEASE_INFO.get(label, {
            "display_name": label,
            "description": "No description available.",
            "treatment": [],
            "prevention": []
        })

        # Grad-CAM input
        img_input = np.expand_dims(img_array, axis=0)
        img_input = preprocess_input(img_input)

        # Generate heatmap
        heatmap = make_gradcam_heatmap(img_input, model, last_conv_layer_name="Conv_1")
        gradcam_img = gradcam_to_base64(original_pil, heatmap)

        # Store original uploaded image as base64
        image_base64 = base64.b64encode(file_bytes).decode("utf-8")

        # Save scan to MongoDB
        scan_document = {
            "filename": file.filename,
            "predicted_class": label,
            "display_name": disease_info.get("display_name", label),
            "description": disease_info.get("description", ""),
            "treatment": disease_info.get("treatment", []),
            "prevention": disease_info.get("prevention", []),
            "confidence": round(confidence * 100, 2),
            "image": image_base64,
            "gradcam": gradcam_img,
            "created_at": datetime.utcnow()
        }

        scans_collection.insert_one(scan_document)

        # Return response
        return JSONResponse({
            "class": label,
            "confidence": round(confidence * 100, 2),
            "gradcam": gradcam_img,
            "disease_info": disease_info
        })

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Prediction failed: {str(e)}"}
        )

@app.get("/history")
def get_history():
    try:
        scans = list(scans_collection.find().sort("created_at", -1))

        for scan in scans:
            scan["_id"] = str(scan["_id"])

        return scans

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to fetch history: {str(e)}"}
        )


@app.get("/analytics")
def get_analytics():
    try:
        total_scans = scans_collection.count_documents({})

        class_distribution = list(
            scans_collection.aggregate([
                {
                    "$group": {
                        "_id": "$predicted_class",
                        "count": {"$sum": 1}
                    }
                },
                {
                    "$sort": {"count": -1}
                }
            ])
        )

        unique_classes = len(class_distribution)
        top_prediction = class_distribution[0]["_id"] if class_distribution else None

        return {
            "total_scans": total_scans,
            "unique_classes": unique_classes,
            "top_prediction": top_prediction,
            "class_distribution": class_distribution
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to fetch analytics: {str(e)}"}
        )