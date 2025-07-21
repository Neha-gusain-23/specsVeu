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

function OrdersContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isOpen, isMobile, isHydrated } = useSidebar();
  const router = useRouter();
  const { token } = router.query;
  const { ci, aid } = decryptToken(token);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const { user, loading, error } = useUserInfo();
  const [notification, setNotification] = useState({ show: false, message: "" });

  // Order statistics data
  const orderStats = [
    {
      title: "Total Orders",
      value: "2,847",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M3 6h18M3 6l1.5 14h15L21 6M16 10a4 4 0 11-8 0" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Processing",
      value: "156",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M3 6h18M3 6l1.5 14h15L21 6M16 10a4 4 0 11-8 0" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600"
    },
    {
      title: "Shipped",
      value: "89",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M3 6h18M3 6l1.5 14h15L21 6M16 10a4 4 0 11-8 0" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Delivered",
      value: "2,602",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M3 6h18M3 6l1.5 14h15L21 6M16 10a4 4 0 11-8 0" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    }
  ];

  // Order data matching the image
  const orders = [
    {
      id: "12345",
      customer: {
        name: "John Doe",
        email: "john@example.com"
      },
      products: "Ray-Ban Aviator Oakley Holbrook",
      total: 219.98,
      status: "Processing",
      payment: "Paid",
      date: "2024-01-15"
    },
    {
      id: "12346",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com"
      },
      products: "Tom Ford TF5401",
      total: 299.99,
      status: "Shipped",
      payment: "Paid",
      date: "2024-01-14"
    },
    {
      id: "12347",
      customer: {
        name: "Mike Johnson",
        email: "mike@example.com"
      },
      products: "Persol 649",
      total: 199.99,
      status: "Delivered",
      payment: "Paid",
      date: "2024-01-13"
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

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M3 6h18M3 6l1.5 14h15L21 6M16 10a4 4 0 11-8 0" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "Shipped":
        return (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M3 6h18M3 6l1.5 14h15L21 6M16 10a4 4 0 11-8 0" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "Delivered":
        return (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
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
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Management</h1>
                <p className="text-gray-500 text-lg">Track and manage customer orders and deliveries</p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {orderStats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6">
                    <div className={`${stat.bgColor} rounded-full p-3 mb-3`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-500 text-sm mt-1">{stat.title}</div>
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
                    placeholder="Search orders by ID, customer name, or email..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a259f7] text-base"
                  />
                </div>
                <select className="px-4 py-3 text-gray-700 rounded-lg border border-gray-200 text-base bg-white">
                  <option>All Status</option>
                </select>
                <select className="px-4 py-3 text-gray-700 rounded-lg border border-gray-200 text-base bg-white">
                  <option>Last 30 days</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-base text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Filter
                </button>
              </div>

              {/* Order Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ORDER ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PRODUCTS</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">TOTAL</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PAYMENT</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">DATE</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">#{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{order.customer.name}</div>
                            <div className="text-gray-500 text-sm">{order.customer.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{order.products}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-gray-700">{order.status}</span>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                              <path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {order.payment}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{order.date}</td>
                        <td className="px-6 py-4">
                          <button className="text-[#a259f7] hover:text-[#7c3aed] transition-colors" title="View">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                              <path d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 10a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
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

export default function Orders() {
  return (
    <SidebarProvider>
      <OrdersContent />
    </SidebarProvider>
  );
} 