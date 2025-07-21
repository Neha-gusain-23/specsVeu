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

function SettingsContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isOpen, isMobile, isHydrated } = useSidebar();
  const router = useRouter();
  const { token } = router.query;
  const { ci, aid } = decryptToken(token);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const { user, loading, error } = useUserInfo();
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [activeSection, setActiveSection] = useState("profile");

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@specsvue.com",
    phone: "+1 (555) 123-4567"
  });

  // Settings categories matching the image
  const settingsCategories = [
    {
      id: "profile",
      name: "Profile",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "security",
      name: "Security",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "appearance",
      name: "Appearance",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="13.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 2h1v4H7zM16 2h1v4h-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 20h1v2H7zM16 20h1v2h-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 7h4v1H2zM2 16h4v1H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 7h2v4h-2zM20 16h2v4h-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2v2M12 20v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12h2M20 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "general",
      name: "General",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "permissions",
      name: "Permissions",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

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

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save changes
  const handleSaveChanges = () => {
    setNotification({ show: true, message: "Profile updated successfully!" });
    const timer = setTimeout(() => setNotification({ show: false, message: "" }), 2000);
    return () => clearTimeout(timer);
  };

  // Only return after all hooks
  if (!ci || !aid) return null;
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen w-full"><Loader /></div>;
  }

  return (
    <>
      {notification.show && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-7 py-3 rounded-xl shadow-xl font-semibold flex items-center gap-2 text-lg animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-500 text-lg">Manage your account settings and preferences</p>
              </div>

              {/* Settings Content */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex">
                  {/* Left Panel - Settings Categories */}
                  <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                    <div className="p-6">
                      <nav className="space-y-2">
                        {settingsCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setActiveSection(category.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                              activeSection === category.id
                                ? 'bg-[#8b5cf6] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {category.icon}
                            <span className="font-medium">{category.name}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Right Panel - Content */}
                  <div className="flex-1 p-8">
                    {activeSection === "profile" && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                        
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 mb-8">
                          <div className="w-20 h-20 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                            <span className="text-white text-xl font-bold">AD</span>
                          </div>
                          <div>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors mb-2">
                              Change Avatar
                            </button>
                            <p className="text-gray-500 text-sm">JPG, GIF or PNG. 1MB max.</p>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                            <input
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                            <input
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Email</label>
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
                            />
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end mt-8">
                          <button
                            onClick={handleSaveChanges}
                            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-base flex items-center gap-2 transition-colors"
                          >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}

                    {activeSection === "security" && (
                      <div className="text-center py-12">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h3>
                        <p className="text-gray-500">Security settings coming soon...</p>
                      </div>
                    )}

                    {activeSection === "notifications" && (
                      <div className="text-center py-12">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Settings</h3>
                        <p className="text-gray-500">Notification preferences coming soon...</p>
                      </div>
                    )}

                    {activeSection === "appearance" && (
                      <div className="text-center py-12">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                          <circle cx="13.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                          <path d="M7 2h1v4H7zM16 2h1v4h-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Appearance Settings</h3>
                        <p className="text-gray-500">Theme and appearance options coming soon...</p>
                      </div>
                    )}

                    {activeSection === "general" && (
                      <div className="text-center py-12">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">General Settings</h3>
                        <p className="text-gray-500">General preferences coming soon...</p>
                      </div>
                    )}

                    {activeSection === "permissions" && (
                      <div className="text-center py-12">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission Settings</h3>
                        <p className="text-gray-500">Permission management coming soon...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function Settings() {
  return (
    <SidebarProvider>
      <SettingsContent />
    </SidebarProvider>
  );
} 