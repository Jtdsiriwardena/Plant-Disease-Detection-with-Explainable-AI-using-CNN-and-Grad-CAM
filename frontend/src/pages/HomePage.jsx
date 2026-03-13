import { Link } from "react-router-dom";
import {
  FiCamera,
  FiClock,
  FiBarChart2,
  FiCpu,
  FiShield,
  FiTrendingUp,
  FiCheckCircle,
  FiHome,
  FiArrowRight,
  FiGithub,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";

function HomePage() {
  const features = [
    {
      icon: <FiCamera className="text-3xl" />,
      title: "AI-Powered Detection",
      description: "Upload leaf images and get instant disease identification with high accuracy using deep learning.",
      color: "green",
      link: "/predict",
      stats: "99.2% accuracy"
    },
    {
      icon: <FiCpu className="text-3xl" />,
      title: "Explainable AI (XAI)",
      description: "Grad-CAM technology highlights exactly which leaf regions influenced the AI's decision.",
      color: "purple",
      link: "/predict",
      stats: "Visual explanations"
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: "Scan History",
      description: "Track all your previous diagnoses with detailed records and confidence scores.",
      color: "blue",
      link: "/history",
      stats: "Unlimited storage"
    },
    {
      icon: <FiBarChart2 className="text-3xl" />,
      title: "Advanced Analytics",
      description: "Comprehensive insights into disease patterns, trends, and detection statistics.",
      color: "yellow",
      link: "/analytics",
      stats: "Real-time insights"
    }
  ];

  const benefits = [
    {
      icon: <FiShield className="text-2xl" />,
      title: "High Accuracy",
      description: "CNN-based model trained on extensive plant disease datasets"
    },
    {
      icon: <FiTrendingUp className="text-2xl" />,
      title: "Fast Processing",
      description: "Get results in under 2 seconds with our optimized pipeline"
    },
    {
      icon: <FiCheckCircle className="text-2xl" />,
      title: "Trustworthy Results",
      description: "Confidence scores and visual explanations for every prediction"
    },
    {
      icon: <FiHome className="text-2xl" />,
      title: "Multi-Crop Support",
      description: "Detect diseases across tomatoes, potatoes, corn, and more"
    }
  ];

  const stats = [
    { value: "50K+", label: "Images Processed", color: "green" },
    { value: "95%", label: "Avg. Accuracy", color: "blue" },
    { value: "30+", label: "Disease Classes", color: "purple" },
    { value: "24/7", label: "Availability", color: "yellow" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 mb-6">
              <FiCpu className="text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-700">
                Powered by Explainable AI
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Plant Disease Classification
              </span>
              <br />
              <span className="text-gray-800">with Explainable AI</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Advanced deep learning system that detects plant diseases from leaf images 
              and explains predictions using Grad-CAM visualizations. Built for farmers, 
              researchers, and agricultural experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/predict"
                className="group bg-linear-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Diagnosis
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/analytics"
                className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                View Analytics
                <FiBarChart2 />
              </Link>
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Everything You Need for Plant Health Monitoring
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and insights to detect, track, and analyze plant diseases effectively
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden"
            >
              <div className={`h-2 bg-${feature.color}-500`}></div>
              <div className="p-6">
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium text-${feature.color}-600 bg-${feature.color}-50 px-2 py-1 rounded-full`}>
                    {feature.stats}
                  </span>
                  <FiArrowRight className={`text-${feature.color}-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Built with cutting-edge technology to provide reliable and interpretable results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-green-100">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple three-step process for accurate disease detection
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
            <p className="text-gray-600">Take or upload a clear photo of the affected plant leaf</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">Our CNN model analyzes the image and identifies the disease</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Results</h3>
            <p className="text-gray-600">Receive diagnosis with confidence score and treatment recommendations</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100 rounded-full -ml-24 -mb-24 opacity-50"></div>
          
          <div className="relative">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Protect Your Crops?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start using our AI-powered plant disease detection system today and ensure healthy crop growth
            </p>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Now
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiHome className="text-green-400 text-2xl" />
                <span className="text-white font-semibold text-lg">PlantAI</span>
              </div>
              <p className="text-sm">
                Advanced plant disease detection with explainable AI for sustainable agriculture.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/predict" className="hover:text-green-400 transition">Prediction</Link></li>
                <li><Link to="/history" className="hover:text-green-400 transition">History</Link></li>
                <li><Link to="/analytics" className="hover:text-green-400 transition">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-sm">
                <li>CNN Deep Learning</li>
                <li>Grad-CAM XAI</li>
                <li>Transfer Learning</li>
                <li>Real-time Processing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-green-400 transition"><FiGithub size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition"><FiTwitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition"><FiLinkedin size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 PlantAI. All rights reserved. Powered by Explainable AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;