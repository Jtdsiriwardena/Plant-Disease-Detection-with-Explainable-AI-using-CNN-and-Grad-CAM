import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCamera,
  FiClock,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiCpu,
} from "react-icons/fi";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive
        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200"
        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
    }`;

  const iconClass = "text-xl";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-xl flex flex-col">
      {/* Logo Section - Fixed at top */}
      <div className="shrink-0 p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <FiCpu className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
              PlantAI
            </h1>
            <p className="text-xs text-gray-500">Diagnostic System</p>
          </div>
        </div>
      </div>

      {/* Navigation Links - Scrollable if needed */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        <NavLink to="/" className={linkClass} end>
          <FiHome className={iconClass} />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/prediction" className={linkClass}>
          <FiCamera className={iconClass} />
          <span>Prediction</span>
        </NavLink>
        
        <NavLink to="/history" className={linkClass}>
          <FiClock className={iconClass} />
          <span>History</span>
        </NavLink>
        
        <NavLink to="/analytics" className={linkClass}>
          <FiBarChart2 className={iconClass} />
          <span>Analytics</span>
        </NavLink>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4"></div>

        {/* Secondary Links */}
        <NavLink to="/settings" className={linkClass}>
          <FiSettings className={iconClass} />
          <span>Settings</span>
        </NavLink>
        
        <NavLink to="/help" className={linkClass}>
          <FiHelpCircle className={iconClass} />
          <span>Help & Support</span>
        </NavLink>
      </nav>

      {/* User Profile Section - Fixed at bottom */}
      <div className="shrink-0 p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-linear-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@plantai.com</p>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <FiLogOut />
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;