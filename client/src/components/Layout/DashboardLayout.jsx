import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Link as LinkIcon,
  Home,
  BarChart2,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
  ];

  const randomSeed = user?.name + Math.floor(Math.random() * 10000);
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}&backgroundColor=000000&textColor=ffffff`;

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] dark:bg-[#000000] text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r flex flex-col transition-transform duration-300 md:translate-x-0 md:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-black/5 dark:border-white/10">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="bg-black dark:bg-white p-1 rounded-md">
              <LinkIcon className="text-white dark:text-black w-4 h-4" />
            </div>
            Linkly
          </Link>
          <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.name === "Analytics" && location.pathname.startsWith("/analytics"));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-white/10 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "" : "opacity-70"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full ring-1 ring-black/10 dark:ring-white/20" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-3.5 h-3.5" /> Dark
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" /> Light
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 glass border-b">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-semibold tracking-tight">Linkly</div>
          <div className="w-5 h-5"></div> {/* Spacer for centering */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
