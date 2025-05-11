import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  Tags,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {useLocation, Link, useNavigate} from "react-router-dom";

const NavItem = ({ icon, label, isCollapsed }) => (
  <div className="flex items-center space-x-3 text-sm cursor-pointer hover:text-[#7c4b2e]">
    {icon}
    {!isCollapsed && <span>{label}</span>}
  </div>
);

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const adminNavLinks = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/adminProducts", label: "Products", icon: <Package size={20} /> },
    { to: "/productTypes", label: "Product Types", icon: <Tags size={20} /> },
    { to: "/subcategories", label: "Subcategories", icon: <ListOrdered size={20} /> },
    { to: "/adminOrders", label: "Orders", icon: <ShoppingCart size={20} /> },
    { to: "/customers", label: "Customers", icon: <Users size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];


  return (
    <>
        <aside
        className={`${
            isCollapsed ? "w-20" : "w-64"
        } bg-[#fbf1e6] p-4 border-r border-gray-200 hidden md:flex flex-col transition-all duration-300 relative`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-4 bg-[#fbf1e6] border border-gray-300 p-1 rounded-full shadow-sm"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Logo / Title */}
            <h1
                className={`font-playfair text-2xl font-bold mb-8 transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
                }`}
            >
                Healthy Bakes & Delights
            </h1>

            {/* Nav Items */}
            <nav className="space-y-6">
                {
                    adminNavLinks.map(({to,label,icon}) => (
                        <Link
                        key={to}
                        to={to}
                        className={`flex items-center space-x-3 text-sm cursor-pointer hover:text-[#7c4b2e] ${
                            currentPath === to ? "text-[#7c4b2e] font-semibold" : "text-[#42210b]"
                        }`}
                        >
                        {<NavItem icon={icon} label={label} isCollapsed={isCollapsed}/>}
                        </Link>
                    ))
                }
            </nav>

            {/* Admin Info */}
            <div
                className={`absolute bottom-6 text-sm transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
                }`}
            >
                <p className="font-semibold">Admin</p>
                <p className="text-[#555]">admin@healthybakes.com</p>
            </div>
        </aside>
        <header className="fixed top-0 left-0 w-full z-50 bg-chocolate-light transition duration-300 shadow-md backdrop-blur-sm mb-10">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                            <button
                                className="rounded-md p-2 text-chocolate-dark hover:text-chocolate-gold"
                                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                </svg>
                            </button>
                </div>
            </div>
        
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                      <div className="md:hidden bg-white shadow-md p-4 space-y-2">
                        {[
                            { name: "Dashboard", path: "/admin" },
                            { name: "Products", path: "/adminProducts" },
                            { name: "Product Types", path: "/productTypes" },
                            { name: "Subcategories", path: "/subcategories" },
                            { name: "Orders", path: "/adminOrders" },
                            { name: "Customers", path: "/customers" },
                            { name: "Settings", path: "/settings" },
                          ].map((item) => {
                              const isActive = currentPath === item.path;
                              return isActive ? (
                                <span
                                  key={item.name}
                                  className="block text-chocolate-gold text-lg font-semibold cursor-default"
                                >
                                {item.name}
                                </span>
                                ) : (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  className="block text-chocolate-dark text-lg font-medium transition hover:text-chocolate-gold"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                {item.name}
                                </Link>
                              );
                            }
                          )
                        }
                      </div>
            )}
        </header>
    </>
  );
};

export default Sidebar;
