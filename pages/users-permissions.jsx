import SideMenu from "../components/sidemenu";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "../context/SidebarContext";
import CryptoJS from "crypto-js";
const ENCRYPTION_KEY = "cyberclipperSecretKey123!";
function decryptToken(token) {
  try {
    const bytes = CryptoJS.AES.decrypt(token, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const { ci, aid } = JSON.parse(decrypted);
    return { ci, aid };
  } catch {
    return { ci: null, aid: null };
  }
}
import { useSidebar } from "../context/SidebarContext";
import { useRouter } from "next/router";
import { useUserInfo } from "../context/UserInfoContext";
import Loader from "../loader/Loader";
import React from "react"; // Added missing import for React.cloneElement

function UsersPermissionsContent() {
  const router = useRouter();
  const { token } = router.query;
  const { ci, aid } = decryptToken(token);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isOpen, isMobile, isHydrated } = useSidebar();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const { user, loading, error } = useUserInfo();
  const [notification, setNotification] = useState({ show: false, message: "" });

  useEffect(() => {
    // Removed login redirect for missing ci/aid
  }, []);

  useEffect(() => {
    if (error) {
      setNotification({ show: true, message: `Error loading user info: ${error}` });
      const timer = setTimeout(() => setNotification({ show: false, message: "" }), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Responsive marginLeft for content (matches header)
  const getContentMarginLeft = () => {
    if (!isHydrated) {
      return 270; // Default to expanded sidebar during SSR
    }
    if (isMobile) {
      return 0;
    }
    return isOpen ? 270 : 64;
  };

  // Dynamically set main content top padding to header height
  useEffect(() => {
    function updateHeaderHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    }
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Hamburger handler for mobile
  const handleMobileSidebarToggle = () => setMobileSidebarOpen((v) => !v);
  const handleMobileSidebarClose = () => setMobileSidebarOpen(false);

  // Ensure mobile sidebar is closed by default when switching to mobile view
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setMobileSidebarOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // User statistics data matching the image
  const userStats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+12% vs last month",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#3b82f6" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="#3b82f6" strokeWidth="2"/>
          <path d="M23 20v-2a4 4 0 0 0-3-3.87" stroke="#3b82f6" strokeWidth="2"/>
          <circle cx="17" cy="7" r="4" stroke="#3b82f6" strokeWidth="2"/>
        </svg>
      ),
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      changeColor: "text-green-600"
    },
    {
      title: "Active Users",
      value: "11,203",
      change: "+8% vs last month",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#10b981" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="#10b981" strokeWidth="2"/>
          <path d="M23 20v-2a4 4 0 0 0-3-3.87" stroke="#10b981" strokeWidth="2"/>
          <circle cx="17" cy="7" r="4" stroke="#10b981" strokeWidth="2"/>
        </svg>
      ),
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      changeColor: "text-green-600"
    },
    {
      title: "VIP Customers",
      value: "1,247",
      change: "+15% vs last month",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#8b5cf6" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="#8b5cf6" strokeWidth="2"/>
          <path d="M23 20v-2a4 4 0 0 0-3-3.87" stroke="#8b5cf6" strokeWidth="2"/>
          <circle cx="17" cy="7" r="4" stroke="#8b5cf6" strokeWidth="2"/>
        </svg>
      ),
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      changeColor: "text-green-600"
    },
    {
      title: "Suspended",
      value: "397",
      change: "-5% vs last month",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#ef4444" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="#ef4444" strokeWidth="2"/>
          <path d="M23 20v-2a4 4 0 0 0-3-3.87" stroke="#ef4444" strokeWidth="2"/>
          <circle cx="17" cy="7" r="4" stroke="#ef4444" strokeWidth="2"/>
        </svg>
      ),
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      changeColor: "text-red-600"
    }
  ];

  // User data matching the image
  const users = [
    {
      initials: "JD",
      name: "John Doe",
      email: "john@example.com",
      role: "Customer",
      joinDate: "2023-12-15",
      orders: 12,
      spent: "$1249.85",
      status: "Active",
      lastLogin: "2024-01-15"
    },
    {
      initials: "JS",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Customer",
      joinDate: "2023-11-20",
      orders: 8,
      spent: "$895.5",
      status: "Active",
      lastLogin: "2024-01-14"
    },
    {
      initials: "MJ",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "VIP Customer",
      joinDate: "2023-10-05",
      orders: 25,
      spent: "$2849.99",
      status: "Active",
      lastLogin: "2024-01-13"
    },
    {
      initials: "SW",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Customer",
      joinDate: "2023-09-12",
      orders: 3,
      spent: "$189.97",
      status: "Suspended",
      lastLogin: "2023-12-20"
    }
  ];

  // Only return after all hooks
  if (!ci || !aid) return null;
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen w-full"><Loader /></div>;
  }

  return (
    <>
      {notification.show && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-7 py-3 rounded-xl shadow-xl font-semibold flex items-center gap-2 text-lg animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            {notification.message}
          </div>
        </div>
      )}
      <div className="bg-[#fbf9f4] min-h-screen flex relative">
        {/* Sidebar for desktop */}
        <div className="hidden sm:block fixed top-0 left-0 h-full z-40" style={{ width: 270 }}>
          <SideMenu />
        </div>
        {/* Sidebar for mobile (full screen overlay) */}
        {mobileSidebarOpen && (
          <div className="sm:hidden fixed inset-0 z-50 bg-white">
            <button className="absolute top-4 right-4 z-60 text-3xl text-gray-500" aria-label="Close sidebar" onClick={handleMobileSidebarClose}>&times;</button>
            <SideMenu mobileOverlay={true} />
          </div>
        )}
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen transition-all duration-300" style={{ marginLeft: getContentMarginLeft() }}>
          {/* Header */}
          <Header ref={headerRef} onMobileSidebarToggle={handleMobileSidebarToggle} mobileSidebarOpen={mobileSidebarOpen} username={user?.name || "admin"} companyName={user?.company || "company name"} />
          <main className="transition-all duration-300 px-2 sm:px-8 py-12 md:py-6" style={{ marginLeft: 0, paddingTop: headerHeight + 16 }}>
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">User Management</h1>
                <p className="text-gray-500 text-lg">Manage customer accounts and user permissions</p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {userStats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6">
                    <div className={`${stat.bgColor} rounded-full p-3 mb-3`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-500 text-sm mt-1">{stat.title}</div>
                    <div className={`text-xs font-semibold mt-1 ${stat.changeColor}`}>{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search users by name, email, or ID..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a259f7] text-base"
                  />
                </div>
                <select className="px-4 py-3 text-gray-700 rounded-lg border border-gray-200 text-base bg-white">
                  <option>All Roles</option>
                </select>
                <select className="px-4 py-3 text-gray-700 rounded-lg border border-gray-200 text-base bg-white">
                  <option>All Status</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-base text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Filter
                </button>
              </div>

              {/* User Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">USER</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ROLE</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">JOIN DATE</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ORDERS</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">TOTAL SPENT</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">LAST LOGIN</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {user.initials}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{user.name}</div>
                              <div className="text-gray-500 text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "VIP Customer" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{user.joinDate}</td>
                        <td className="px-6 py-4 text-gray-700">{user.orders}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{user.spent}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{user.lastLogin}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3 items-center">
                            <button className="text-[#a259f7] hover:text-[#7c3aed] transition-colors" title="View">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 10a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </button>
                            <button className="text-[#a259f7] hover:text-[#7c3aed] transition-colors" title="Edit">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </button>
                            <button className="text-[#a259f7] hover:text-[#7c3aed] transition-colors" title="Email">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </button>
                            <button className="text-red-500 hover:text-red-700 transition-colors" title="Suspend">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function UsersPermissions() {
  return (
    <SidebarProvider>
      <UsersPermissionsContent />
    </SidebarProvider>
  );
}
