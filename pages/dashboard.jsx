import SideMenu from "../components/sidemenu";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { SidebarProvider } from "../context/SidebarContext";
import { useSidebar } from "../context/SidebarContext";
import { useRouter } from "next/router";
import { useUserInfo } from "../context/UserInfoContext";
import Loader from "../loader/Loader";
import CryptoJS from "crypto-js";
import Support from "../components/support";
import useStoreEmployees from "../hooks/useStoreEmployees";
import useStorePassword from "../hooks/useStorePassword";
import useNotesTasks from "../hooks/useNotesTasks";
import useAnnouncements from "../hooks/useAnnouncements";
import { totalMedia } from "./data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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
function encryptToken(ci, aid) {
  const data = JSON.stringify({ ci, aid });
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

function DashboardContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isOpen, isMobile, isHydrated } = useSidebar();
  const router = useRouter();
  const { token } = router.query;
  const { ci, aid } = decryptToken(token);
  console.log("Token:", token); // DEBUG
  console.log("Decrypted:", ci, aid); // DEBUG
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const { user, loading, error } = useUserInfo();
  const [notification, setNotification] = useState({ show: false, message: "" });

  // Fetch data from hooks
  const employeesHook = useStoreEmployees(ci);
  const passwordsHook = useStorePassword(ci);
  const tasksHook = useNotesTasks(ci);
  const announcementsHook = useAnnouncements(ci);

  // Loading and error states
  const isAnyLoading = loading || employeesHook.loading || passwordsHook.loading || tasksHook.loading || announcementsHook.loading;
  const anyError = error || employeesHook.error || passwordsHook.error || tasksHook.error || announcementsHook.error;

  // Real counts
  const totalEmployees = employeesHook.employees?.length || 0;
  const totalPasswords = passwordsHook.passwords?.length || 0;
  const totalTasks = tasksHook.tasks?.length || 0;
  const totalAnnouncements = announcementsHook.announcements?.length || 0;

  // Mock data for products, users, media
  // Use the real totalMedia from the Data page
  // (If you want to fetch from Firestore in the future, update both places)
  const totalProducts = 89; // TODO: Replace with real data if available
  const totalUsers = 2345;  // TODO: Replace with real data if available
  // const totalMedia = 42;    // TODO: Replace with real data if available

  // Recent activity (latest 3)
  const recentEmployees = (employeesHook.employees || []).slice(-3).reverse();
  const recentTasks = (tasksHook.tasks || []).slice(0, 3);
  const recentAnnouncements = (announcementsHook.announcements || []).slice(0, 3);

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
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen w-full"><Loader /></div>;
  }
  if (anyError) {
    return <div className="flex items-center justify-center min-h-screen w-full"><Loader />Error: {anyError}</div>;
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
      {anyError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-7 py-3 rounded-xl shadow-xl font-semibold flex items-center gap-2 text-lg animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            {anyError}
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
              <h1 className="text-4xl font-extrabold text-gray-900 mt-8">Welcome back! Here's what's happening...</h1>
              {/* Remove the dashboard search bar here */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 mb-8">
                {/* Total Orders */}
                <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6">
                  <div className="bg-blue-100 rounded-full p-3 mb-2">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M3 6l1.5 14h15L21 6M16 10a4 4 0 11-8 0" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">2,847</div>
                  <div className="text-gray-500 text-sm mt-1">Total Orders</div>
                </div>
                {/* Revenue */}
                <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6">
                  <div className="bg-green-100 rounded-full p-3 mb-2">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 8v8m0 0c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2v2m0 16v2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">$48,392</div>
                  <div className="text-gray-500 text-sm mt-1">Revenue</div>
                </div>
                {/* Active Users */}
                <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6">
                  <div className="bg-purple-100 rounded-full p-3 mb-2">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#a259f7" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="#a259f7" strokeWidth="2"/><path d="M23 20v-2a4 4 0 0 0-3-3.87" stroke="#a259f7" strokeWidth="2"/><circle cx="17" cy="7" r="4" stroke="#a259f7" strokeWidth="2"/></svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">12,847</div>
                  <div className="text-gray-500 text-sm mt-1">Active Users</div>
                </div>
                {/* Low Stock Alerts */}
                <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6">
                  <div className="bg-orange-100 rounded-full p-3 mb-2">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01M21 19H3a2 2 0 01-2-2V7a2 2 0 012-2h18a2 2 0 012 2v10a2 2 0 01-2 2z" stroke="#f59e42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-gray-500 text-sm mt-1">Low Stock Alerts</div>
                </div>
              </div>
              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sales Overview Bar Chart */}
                <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                      <span className="text-gray-500 text-sm">Last updated: 2 minutes ago</span>
                    </div>
                    <select className="border border-gray-200 rounded px-2 py-1 text-sm text-gray-700">
                      <option>Last 6 months</option>
                      <option>Last 12 months</option>
                    </select>
                  </div>
                  <div className="flex-1 min-h-[220px]">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={[{month:'Jan',sales:1200},{month:'Feb',sales:2100},{month:'Mar',sales:3200},{month:'Apr',sales:4100},{month:'May',sales:4800},{month:'Jun',sales:5400}]}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{fontSize:13}}/>
                        <YAxis tick={{fontSize:13}}/>
                        <Tooltip />
                        <Bar dataKey="sales" fill="#a259f7" radius={[8,8,0,0]} barSize={32}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 text-gray-700 font-semibold text-lg">Sales Overview</div>
                </div>
                {/* Orders Trend Line Chart */}
                <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                      <span className="text-gray-500 text-sm">Last updated: 2 minutes ago</span>
                    </div>
                    <select className="border border-gray-200 rounded px-2 py-1 text-sm text-gray-700">
                      <option>Last 6 months</option>
                      <option>Last 12 months</option>
                    </select>
                  </div>
                  <div className="flex-1 min-h-[220px]">
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={[{month:'Jan',orders:400},{month:'Feb',orders:900},{month:'Mar',orders:1800},{month:'Apr',orders:3200},{month:'May',orders:4200},{month:'Jun',orders:2500}]}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{fontSize:13}}/>
                        <YAxis tick={{fontSize:13}}/>
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#a259f7" strokeWidth={3} dot={{r:5,stroke:'#a259f7',strokeWidth:2,fill:'#fff'}} activeDot={{r:7}}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 text-gray-700 font-semibold text-lg">Orders Trend</div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="mt-16 mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { id: 'ORD-1001', customer: 'Amit Sharma', date: '2024-06-10', amount: '$1,200', status: 'Completed' },
                        { id: 'ORD-1002', customer: 'Priya Singh', date: '2024-06-09', amount: '$850', status: 'Pending' },
                        { id: 'ORD-1003', customer: 'Rahul Verma', date: '2024-06-08', amount: '$2,100', status: 'Cancelled' },
                      ].map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4 font-medium text-gray-900">{order.id}</td>
                          <td className="px-4 py-4 text-gray-700">{order.customer}</td>
                          <td className="px-4 py-4 text-gray-500">{order.date}</td>
                          <td className="px-4 py-4 text-gray-900">{order.amount}</td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
