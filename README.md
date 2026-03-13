# 🌿 Plant Disease Detection with Explainable AI using CNN and Grad-CAM

A full-stack AI-powered web application that detects plant diseases from leaf images using deep learning, and provides visual explanations of predictions using Grad-CAM alongside actionable treatment recommendations.

> Built with MobileNetV2, FastAPI, React, and MongoDB — combining CNN-based disease detection with Explainable AI for real-world agricultural use.

---

![Image Alt](https://github.com/Jtdsiriwardena/Plant-Disease-Detection-with-Explainable-AI-using-CNN-and-Grad-CAM/blob/7c936adf80007083874910934816766d1355ccac/Home.png) 

## 🎯 Objective

This system assists **farmers, agricultural researchers, and students** by:

- Detecting plant diseases from leaf images using a **Convolutional Neural Network (CNN)**
- Providing **visual explainability** of model predictions using **Grad-CAM**
- Delivering **treatment and prevention recommendations** through a Disease Information Recommendation Module

---

## 🚀 Features

### 🔍 Disease Detection
- Upload a leaf image and receive an instant **disease classification**
- Confidence score returned alongside the prediction
- Supports **15 plant disease categories** across Pepper, Potato, and Tomato plants

### 🧠 Explainable AI (Grad-CAM)
- Heatmap overlay highlights **which regions of the leaf** the model focused on
- Increases transparency and trust in AI predictions
- Uses gradients from the last convolutional layer (`Conv_1`)

### 💊 Disease Recommendation System
- Automatically displays after each prediction:
  - Disease name and description
  - Treatment recommendations
  - Prevention strategies
- Powered by a structured knowledge base (`disease_info.json`)

### 📊 Analytics Dashboard
- Total scans performed
- Disease distribution charts
- Most frequent disease predictions
- Prediction trends over time

### 🕓 Prediction History
- All previous scans stored in MongoDB
- Browse past results with images, predictions, and confidence scores

---

## 🌱 Supported Plant Disease Classes

| Plant | Disease |
|---|---|
| Pepper Bell | Bacterial Spot |
| Pepper Bell | Healthy |
| Potato | Early Blight |
| Potato | Late Blight |
| Potato | Healthy |
| Tomato | Bacterial Spot |
| Tomato | Early Blight |
| Tomato | Late Blight |
| Tomato | Leaf Mold |
| Tomato | Septoria Leaf Spot |
| Tomato | Spider Mites |
| Tomato | Target Spot |
| Tomato | Yellow Leaf Curl Virus |
| Tomato | Mosaic Virus |
| Tomato | Healthy |

---

## 🧬 Model Architecture

| Component | Details |
|---|---|
| **Base Model** | MobileNetV2 (pretrained on ImageNet) |
| **Input Shape** | `(224, 224, 3)` |
| **Key Layers** | Depthwise Separable Convolutions, Batch Normalization, ReLU, Global Average Pooling, Dense, Dropout |
| **Output Layer** | Softmax — 15 classes |
| **Framework** | TensorFlow |

### Training Configuration

| Setting | Value |
|---|---|
| Loss Function | Categorical Crossentropy |
| Optimizer | Adam |
| Metric | Classification Accuracy |
| Training Split | 80% train / 10% val / 10% test |
| Preprocessing | `preprocess_input` normalization |
| Augmentation | Rotation, horizontal flip, zoom |
| **Accuracy** | **95% – 99%** |

---

## 🔬 Explainability — Grad-CAM

**Grad-CAM (Gradient-weighted Class Activation Mapping)** provides visual explanations for model predictions.

**How it works:**

```
1. Compute gradients of the predicted class
   with respect to the last Conv layer (Conv_1)
        ↓
2. Extract feature maps from the Conv layer
        ↓
3. Weight feature maps using the gradients
        ↓
4. Generate a heatmap of important regions
        ↓
5. Overlay heatmap on the original leaf image
```

This allows users to **visually understand** why the model predicted a particular disease.

---

## 🏗 System Architecture

```
        Leaf Image Upload
               ↓
     CNN Model (MobileNetV2)
               ↓
       Disease Prediction
               ↓
    Grad-CAM Explainability
               ↓
    Disease Knowledge Base
               ↓
   Treatment Recommendation
               ↓
    Web Interface (React)
               ↓
  MongoDB Storage + Analytics
```

---

## 🛠 Tech Stack

### 🤖 AI / ML
| Technology | Purpose |
|---|---|
| TensorFlow  | Model training & inference |
| MobileNetV2 | CNN base model |
| Grad-CAM | Explainable AI visualizations |
| PlantVillage Dataset | Training data |

### ⚙️ Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| MongoDB | Prediction history storage |

### 🖥️ Frontend
| Technology | Purpose |
|---|---|
| React  | Component-based UI |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP communication with backend |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Upload leaf image → returns prediction, confidence, Grad-CAM heatmap, and disease info |
| `GET` | `/history` | Retrieve previous scan results |
| `GET` | `/analytics` | Aggregated scan statistics and disease distribution |

---

## 💾 Database Schema (MongoDB)

```
predictions
 └── filename
 └── predicted_class
 └── confidence
 └── image
 └── gradcam
 └── created_at
```

---

## ⚙️ Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/plant-disease-xai.git
```

**2. Set up the backend**

```bash
cd backend
pip install -r requirements.txt
```

**3. Set up the frontend**

```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

### Backend — create a `.env` file in `/backend`:

```env
MONGO_URI=your_mongodb_connection_string
MODEL_PATH=./model/plant_disease_model.h5
DISEASE_INFO_PATH=./data/disease_info.json
```

---

## ▶️ Running the Application

**Start the backend**

```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Start the frontend**

```bash
cd frontend
npm run dev
```

| Service | URL |
|---|---|
| Backend (FastAPI) | http://localhost:8000 |
| Frontend (React) | http://localhost:5173 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

---

## 📸 Screenshots


**Upload, Predict and Grad-CAM Heatmap**

![Image Alt](https://github.com/Jtdsiriwardena/Plant-Disease-Detection-with-Explainable-AI-using-CNN-and-Grad-CAM/blob/7c936adf80007083874910934816766d1355ccac/Prediction.png) 

**History**

![Image Alt](https://github.com/Jtdsiriwardena/Plant-Disease-Detection-with-Explainable-AI-using-CNN-and-Grad-CAM/blob/7c936adf80007083874910934816766d1355ccac/History.png) 

**Analysis**

![Image Alt](https://github.com/Jtdsiriwardena/Plant-Disease-Detection-with-Explainable-AI-using-CNN-and-Grad-CAM/blob/7c936adf80007083874910934816766d1355ccac/Analysis.png) 



---
