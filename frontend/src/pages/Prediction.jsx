import { useState } from "react";
import axios from "axios";
import {
  FiUpload,
  FiActivity,
  FiShield,
  FiThermometer,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiCpu,
  FiDroplet,
  FiWind,
  FiSun,
} from "react-icons/fi";

function Prediction() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);

      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error predicting image. Check your backend!");
    } finally {
      setLoading(false);
    }
  };

  function confidenceColor(conf) {
    if (conf > 90) return "text-green-600";
    if (conf > 70) return "text-yellow-600";
    return "text-red-600";
  }

  function getConfidenceLevel(conf) {
    if (conf > 90) return "High Confidence";
    if (conf > 70) return "Medium Confidence";
    return "Low Confidence - Verify Manually";
  }

  function getConfidenceIcon(conf) {
    if (conf > 90) return <FiCheckCircle className="text-green-600 text-xl" />;
    if (conf > 70) return <FiAlertCircle className="text-yellow-600 text-xl" />;
    return <FiAlertCircle className="text-red-600 text-xl" />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      {/* Header with AI Badge */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FiCpu className="text-green-600 text-3xl" />
              <h1 className="text-4xl font-bold bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Plant Disease AI Diagnostic Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg ml-12">
              Advanced deep learning analysis powered by Grad-CAM visualization
            </p>
          </div>
          {result && (
            <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI Model: Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="max-w-7xl mx-auto">
        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 rounded-2xl p-8 transition-all ${
              dragActive
                ? "border-green-500 bg-green-50/50"
                : "border-gray-300 bg-white/80 backdrop-blur-sm"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="text-center">
              {!preview ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUpload className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-lg text-gray-700 mb-2">
                    Drag & drop your plant image here, or <span className="text-green-600 font-semibold">browse</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports high-resolution images (JPG, PNG) • Max 10MB
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-20 w-20 object-cover rounded-lg border-2 border-green-200"
                  />
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Selected image ready for analysis</p>
                    <p className="text-xs text-gray-500 mt-1">Click or drag to change</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {preview && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>AI is analyzing your image...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <FiCpu className="text-xl" />
                    <span>Run AI Diagnosis</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-6">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                <p className="text-sm text-gray-500 mb-1">Diagnosis</p>
                <p className="font-semibold text-gray-800">{result.class}</p>
              </div>
              
              
              <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm text-gray-500 mb-1">Severity Level</p>
                <p className="font-semibold text-gray-800">
                  {result.disease_info?.severity || "Moderate"}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
                <p className="text-sm text-gray-500 mb-1">Treatment Steps</p>
                <p className="font-semibold text-gray-800">
                  {result.disease_info?.treatment?.length || 0} recommendations
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Disease Card & Confidence */}
              <div className="lg:col-span-1 space-y-6">
                {/* Confidence Meter Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiActivity className="text-green-600" />
                    Confidence Analysis
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">AI Confidence Score</span>
                      <span className={`text-3xl font-bold ${confidenceColor(result.confidence)}`}>
                        {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          result.confidence > 90
                            ? "bg-linear-to-r from-green-400 to-green-600"
                            : result.confidence > 70
                            ? "bg-linear-to-r from-yellow-400 to-yellow-600"
                            : "bg-linear-to-r from-red-400 to-red-600"
                        }`}
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {getConfidenceIcon(result.confidence)}
                      <p className="text-sm text-gray-600">
                        {getConfidenceLevel(result.confidence)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Model Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing Time</span>
                        <span className="font-medium text-gray-800">&lt; 1 second</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Model Version</span>
                        <span className="font-medium text-gray-800">v2.1.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-linear-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FiInfo />
                    Disease Overview
                  </h4>
                  <p className="text-sm opacity-90 mb-4">
                    {result.disease_info?.description?.substring(0, 120)}...
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <FiDroplet className="mx-auto mb-1" />
                      <span className="text-xs">High Humidity</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <FiWind className="mx-auto mb-1" />
                      <span className="text-xs">Poor Airflow</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <FiSun className="mx-auto mb-1" />
                      <span className="text-xs">Low Light</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                      <FiThermometer className="mx-auto mb-1" />
                      <span className="text-xs">Warm Temp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column - Grad-CAM & Treatment */}
              <div className="lg:col-span-1 space-y-6">
                {/* Grad-CAM Card */}
                {result.gradcam && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiCpu className="text-purple-600" />
                      Grad-CAM Visualization
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Heatmap shows areas the AI focused on for diagnosis
                    </p>
                    <div className="relative group">
                      <img
                        src={`data:image/png;base64,${result.gradcam}`}
                        alt="Grad-CAM Heatmap"
                        className="w-full rounded-xl border-2 border-gray-200 transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        AI Attention Map
                      </div>
                    </div>
                  </div>
                )}

                {/* Symptoms Card */}
                {result.disease_info?.symptoms && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiAlertCircle className="text-orange-500" />
                      Key Symptoms
                    </h3>
                    <div className="space-y-2">
                      {result.disease_info.symptoms.map((symptom, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></div>
                          <span className="text-sm text-gray-700">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Treatment & Prevention */}
              <div className="lg:col-span-1 space-y-6">
                {/* Treatment Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiShield className="text-blue-600" />
                    Treatment Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.disease_info?.treatment?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                        <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prevention Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiCheckCircle className="text-green-600" />
                    Prevention Measures
                  </h3>
                  <div className="space-y-3">
                    {result.disease_info?.prevention?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                        <FiCheckCircle className="text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prediction;