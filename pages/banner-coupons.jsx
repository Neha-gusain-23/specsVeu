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

function BannerCouponsContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isOpen, isMobile, isHydrated } = useSidebar();
  const router = useRouter();
  const { token } = router.query;
  const { ci, aid } = decryptToken(token);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const { user, loading, error } = useUserInfo();
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [activeTab, setActiveTab] = useState("banners");

  // Statistics data matching the image
  const stats = [
    {
      title: "Active Banners",
      value: "2",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="7" width="18" height="10" rx="2" stroke="#8b5cf6" strokeWidth="2"/>
          <path d="M7 7l5 5 5-5" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      title: "Active Coupons",
      value: "2",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Total Coupon Usage",
      value: "334",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Expired Coupons",
      value: "2",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-red-100",
      textColor: "text-red-600"
    }
  ];

  // Banner data matching the image
  const banners = [
    {
      id: 1,
      title: "Summer Sale Banner",
      image: "/api/placeholder/300/200",
      link: "/summer-sale",
      created: "2024-01-15",
      status: "Active",
      position: "1"
    },
    {
      id: 2,
      title: "New Collection Banner",
      image: "/api/placeholder/300/200",
      link: "/new-collection",
      created: "2024-01-14",
      status: "Active",
      position: "2"
    }
  ];

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

  // Only return after all hooks
  // Remove ci/aid check
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
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Banners & Coupons</h1>
                <p className="text-gray-500 text-lg">Manage promotional banners and discount coupons</p>
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
                      onClick={() => setActiveTab("banners")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "banners"
                          ? "border-[#8b5cf6] text-[#8b5cf6]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Banners
                    </button>
                    <button
                      onClick={() => setActiveTab("coupons")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "coupons"
                          ? "border-[#8b5cf6] text-[#8b5cf6]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Coupons
                    </button>
                  </nav>
                </div>
              </div>

              {/* Content based on active tab */}
              {activeTab === "banners" && (
                <div>
                  {/* Banners Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Homepage Banners</h2>
                    <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-base flex items-center gap-2 transition-colors">
                      <span className="text-xl font-bold">+</span> Add Banner
                    </button>
                  </div>

                  {/* Banners Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                      <div key={banner.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="aspect-video bg-gray-100 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                              <rect x="3" y="7" width="18" height="10" rx="2" stroke="#d1d5db" strokeWidth="2"/>
                              <path d="M7 7l5 5 5-5" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{banner.title}</h3>
                              <p className="text-gray-500 text-sm">Link: {banner.link}</p>
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              banner.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                              {banner.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span>Created: {banner.created}</span>
                            <span>Position: {banner.position}</span>
                          </div>
                          <div className="flex gap-3">
                            <button className="flex-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                              Edit
                            </button>
                            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                              Hide
                            </button>
                            <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "coupons" && (
                <div>
                  {/* Coupons Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Discount Coupons</h2>
                    <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-base flex items-center gap-2 transition-colors">
                      <span className="text-xl font-bold">+</span> Add Coupon
                    </button>
                  </div>

                  {/* Coupons Content */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="text-center py-12">
                      <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Coupons Yet</h3>
                      <p className="text-gray-500 mb-4">Create your first discount coupon to start promoting your products</p>
                      <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        Create First Coupon
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function BannerCoupons() {
  return (
    <SidebarProvider>
      <BannerCouponsContent />
    </SidebarProvider>
  );
} 