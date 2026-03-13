import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiDownload,
  FiTrash2,
  FiEye,
  FiBarChart2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterBy, setFilterBy] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    healthy: 0,
    diseased: 0,
    avgConfidence: 0,
  });

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/history");
      setHistory(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const healthy = data.filter(item => 
      item.predicted_class?.toLowerCase().includes("healthy")
    ).length;
    const diseased = total - healthy;
    const avgConfidence = data.reduce((acc, item) => 
      acc + (item.confidence || 0), 0) / total || 0;

    setStats({
      total,
      healthy,
      diseased,
      avgConfidence: avgConfidence.toFixed(1),
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/history/${id}`);
        const updatedHistory = history.filter(item => item._id !== id);
        setHistory(updatedHistory);
        calculateStats(updatedHistory);
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("Failed to delete record");
      }
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `plant-disease-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.predicted_class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.disease_info?.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "healthy") {
      return matchesSearch && item.predicted_class?.toLowerCase().includes("healthy");
    } else if (filterBy === "diseased") {
      return matchesSearch && !item.predicted_class?.toLowerCase().includes("healthy");
    }
    return matchesSearch;
  });

  function confidenceColor(conf) {
    if (conf > 90) return "text-green-600 bg-green-100";
    if (conf > 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
              Scan History Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Track and analyze all your plant disease detection records
            </p>
          </div>
          
          {/* Export Button */}
          {history.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all text-gray-700"
            >
              <FiDownload className="text-green-600" />
              Export Data
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && history.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Scans</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiBarChart2 className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Healthy Plants</p>
                  <p className="text-3xl font-bold text-green-600">{stats.healthy}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Diseased Plants</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.diseased}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiAlertCircle className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg. Confidence</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.avgConfidence}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      {!loading && history.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by disease name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterBy("all")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    filterBy === "all"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FiFilter /> All
                </button>
                <button
                  onClick={() => setFilterBy("healthy")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    filterBy === "healthy"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FiCheckCircle /> Healthy
                </button>
                <button
                  onClick={() => setFilterBy("diseased")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    filterBy === "diseased"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FiAlertCircle /> Diseased
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading your scan history...</p>
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No scan history found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search" : "Start by uploading a plant image for diagnosis"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => window.location.href = "/predict"}
                  className="bg-linear-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700"
                >
                  Go to Prediction
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gray-100">
                  {item.image ? (
                    <img
                      src={`data:image/jpeg;base64,${item.image}`}
                      alt={item.predicted_class}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiEye className="text-gray-400 text-4xl" />
                    </div>
                  )}
                  
                  {/* Confidence Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${confidenceColor(item.confidence)}`}>
                      {item.confidence?.toFixed(1)}% Confidence
                    </span>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <FiCalendar />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.predicted_class}
                  </h3>
                  
                  {item.disease_info?.display_name && (
                    <p className="text-sm text-gray-600 mb-3">
                      {item.disease_info.display_name}
                    </p>
                  )}

                  {/* Treatment Preview */}
                  {item.disease_info?.treatment && item.disease_info.treatment.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Treatment:</p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {item.disease_info.treatment[0]}
                      </p>
                    </div>
                  )}

                  {/* Time */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <FiClock />
                    {new Date(item.created_at).toLocaleTimeString()}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <FiEye /> View Details
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Scan Details</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Modal Image */}
              {selectedItem.image && (
                <img
                  src={`data:image/jpeg;base64,${selectedItem.image}`}
                  alt={selectedItem.predicted_class}
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
              )}

              {/* Details Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Prediction</p>
                    <p className="font-semibold">{selectedItem.predicted_class}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Confidence</p>
                    <p className={`font-semibold ${confidenceColor(selectedItem.confidence)}`}>
                      {selectedItem.confidence?.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {selectedItem.disease_info && (
                  <>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Scientific Name</p>
                      <p className="font-semibold">{selectedItem.disease_info.scientific_name || "N/A"}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Description</p>
                      <p className="text-sm">{selectedItem.disease_info.description}</p>
                    </div>

                    {selectedItem.disease_info.treatment && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-2">Treatment</p>
                        <ul className="list-disc ml-4 space-y-1">
                          {selectedItem.disease_info.treatment.map((t, i) => (
                            <li key={i} className="text-sm">{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedItem.disease_info.prevention && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-2">Prevention</p>
                        <ul className="list-disc ml-4 space-y-1">
                          {selectedItem.disease_info.prevention.map((p, i) => (
                            <li key={i} className="text-sm">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                <div className="text-xs text-gray-500 text-right">
                  Scanned on: {new Date(selectedItem.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;