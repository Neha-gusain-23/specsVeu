import SideMenu from "../components/sidemenu";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "../context/SidebarContext";
import { useSidebar } from "../context/SidebarContext";
import { useRouter } from "next/router";
import { useUserInfo } from "../context/UserInfoContext";
import Loader from "../loader/Loader";
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

function NotificationsContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isOpen, isMobile, isHydrated } = useSidebar();
  const router = useRouter();
  const { token } = router.query;
  const { ci, aid } = decryptToken(token);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const { user, loading, error } = useUserInfo();
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [activeTab, setActiveTab] = useState("compose");

  // Statistics data matching the image
  const stats = [
    {
      title: "Total Sent",
      value: "5,680",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M3 19l18-7-18-7v6l12 1-12 1v6z" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      title: "Active Templates",
      value: "2",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="20" cy="4" r="2" fill="#60a5fa"/>
        </svg>
      ),
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Subscribers",
      value: "12,450",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5.13a4 4 0 11-8 0 4 4 0 018 0z" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Open Rate",
      value: "68.5%",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#fbbf24" strokeWidth="2"/>
          <path d="M12 8v4l3 3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="4" fill="#fbbf24" fillOpacity="0.2"/>
        </svg>
      ),
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600"
    }
  ];

  // Compose form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Both");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Users");
  const [schedule, setSchedule] = useState("");

  useEffect(() => {
    if (router.isReady && (!ci || !aid)) {
      router.replace("/auth/login");
    }
  }, [router.isReady, ci, aid]);

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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {notification.message}
          </div>
        </div>
      )}
      <div className="bg-[#fbf9f4] min-h-screen flex relative">
        {/* Sidebar for desktop */}
        <div
          className="hidden sm:block fixed top-0 left-0 h-full z-40"
          style={{ width: 270 }}
        >
          <SideMenu />
        </div>
        {/* Sidebar for mobile (full screen overlay) */}
        {mobileSidebarOpen && (
          <div className="sm:hidden fixed inset-0 z-50 bg-white">
            <button
              className="absolute top-4 right-4 z-60 text-3xl text-gray-500"
              aria-label="Close sidebar"
              onClick={handleMobileSidebarClose}
            >
              &times;
            </button>
            <SideMenu mobileOverlay={true} />
          </div>
        )}
        {/* Main content area */}
        <div
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
          style={{ marginLeft: getContentMarginLeft() }}
        >
          {/* Header */}
          <Header
            ref={headerRef}
            onMobileSidebarToggle={handleMobileSidebarToggle}
            mobileSidebarOpen={mobileSidebarOpen}
            username={user?.name || "admin"}
            companyName={user?.company || "company name"}
          />
          <main
            className="transition-all duration-300 px-2 sm:px-8 py-12 md:py-6"
            style={{ marginLeft: 0, paddingTop: headerHeight + 16 }}
          >
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Notification Center</h1>
                <p className="text-gray-500 text-lg">Manage push notifications and email campaigns</p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6">
                    <div className={`${stat.bgColor} rounded-full p-3 mb-3`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-500 text-sm mt-1">{stat.title}</div>
                  </div>
                ))}
              </div>

              {/* Tab Navigation */}
              <div className="mb-8">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("compose")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "compose"
                          ? "border-[#8b5cf6] text-[#8b5cf6]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Compose
                    </button>
                    <button
                      onClick={() => setActiveTab("templates")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "templates"
                          ? "border-[#8b5cf6] text-[#8b5cf6]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Templates
                    </button>
                    <button
                      onClick={() => setActiveTab("history")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "history"
                          ? "border-[#8b5cf6] text-[#8b5cf6]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      History
                    </button>
                  </nav>
                </div>
              </div>

              {/* Content based on active tab */}
              {activeTab === "compose" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Notification Title</label>
                      <input
                        type="text"
                        placeholder="Enter notification title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Notification Type</label>
                      <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all bg-white"
                      >
                        <option value="Both">Both</option>
                        <option value="Push">Push</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Message</label>
                    <textarea
                      placeholder="Enter your message..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Target Audience</label>
                      <select
                        value={audience}
                        onChange={e => setAudience(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all bg-white"
                      >
                        <option value="All Users">All Users</option>
                        <option value="VIP Customers">VIP Customers</option>
                        <option value="Active Users">Active Users</option>
                        <option value="Suspended Users">Suspended Users</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Schedule (Optional)</label>
                      <input
                        type="text"
                        placeholder="dd-mm-yyyy  --:--"
                        value={schedule}
                        onChange={e => setSchedule(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-3 px-8 rounded-xl shadow-lg text-base flex items-center gap-2 transition-colors">
                      Send Notification
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-xl shadow-lg text-base flex items-center gap-2 transition-colors">
                      Save as Draft
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "templates" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400">
                  <p>Templates management coming soon...</p>
                </div>
              )}

              {activeTab === "history" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-400">
                  <p>Notification history coming soon...</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function Notifications() {
  return (
    <SidebarProvider>
      <NotificationsContent />
    </SidebarProvider>
  );
} 