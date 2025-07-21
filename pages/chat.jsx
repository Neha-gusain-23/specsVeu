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

function ChatContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isOpen, isMobile, isHydrated } = useSidebar();
  const router = useRouter();
  const { token } = router.query;
  const { ci, aid } = decryptToken(token);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const { user, loading, error } = useUserInfo();
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Chats");
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  // Statistics data matching the image
  const stats = [
    {
      title: "Total Conversations",
      value: "3",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      title: "Active Chats",
      value: "1",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Pending",
      value: "1",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#fbbf24" strokeWidth="2"/>
          <path d="M12 8v4l3 3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600"
    },
    {
      title: "Unread Messages",
      value: "3",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: "bg-red-100",
      textColor: "text-red-600"
    }
  ];

  // Chat data matching the image
  const chats = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      lastMessage: "Hi, I need help with my recent order",
      timeAgo: "2 min ago",
      unreadCount: 2,
      status: "active",
      messages: [
        {
          id: 1,
          sender: "customer",
          message: "Hi, I need help with my recent order",
          timestamp: "10:30 AM"
        },
        {
          id: 2,
          sender: "customer",
          message: "The glasses I ordered don't fit properly",
          timestamp: "10:32 AM"
        }
      ]
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      lastMessage: "Thank you for the quick response!",
      timeAgo: "1 hour ago",
      unreadCount: 0,
      status: "resolved",
      messages: []
    },
    {
      id: 3,
      name: "Bob Wilson",
      email: "bob.wilson@example.com",
      lastMessage: "I have a question about frame sizes",
      timeAgo: "3 hours ago",
      unreadCount: 1,
      status: "pending",
      messages: []
    }
  ];

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get selected chat data
  const selectedChatData = chats.find(chat => chat.id === selectedChat);

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

  // Filter chats based on search
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Chat Support</h1>
                <p className="text-gray-500 text-lg">Manage customer conversations and support tickets</p>
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

              {/* Chat Interface */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex h-[600px]">
                  {/* Chat List - Left Side */}
                  <div className="w-1/3 border-r border-gray-200 flex flex-col">
                    {/* Search and Filter */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex gap-2 mb-3">
                        <div className="flex-1 relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent text-sm"
                          />
                        </div>
                        <select
                          value={selectedFilter}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent text-sm bg-white"
                        >
                          <option value="All Chats">All Chats</option>
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto">
                      {filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat.id)}
                          className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                            selectedChat === chat.id ? 'bg-purple-50 border-l-4 border-l-[#8b5cf6]' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 text-sm">{chat.name}</h3>
                                {chat.unreadCount > 0 && (
                                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {chat.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-500 text-xs">{chat.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-xs mb-1">{chat.timeAgo}</p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(chat.status)}`}>
                                {chat.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm truncate">{chat.lastMessage}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Conversation - Right Side */}
                  <div className="flex-1 flex flex-col">
                    {selectedChatData ? (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{selectedChatData.name}</h3>
                            <p className="text-gray-500 text-sm">{selectedChatData.email}</p>
                          </div>
                          <select
                            defaultValue={selectedChatData.status}
                            className="px-3 py-1 border border-gray-200 rounded-lg text-sm bg-white"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {selectedChatData.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                            >
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === 'customer' 
                                  ? 'bg-gray-100 text-gray-900' 
                                  : 'bg-[#8b5cf6] text-white'
                              }`}>
                                <p className="text-sm">{message.message}</p>
                                <p className={`text-xs mt-1 ${
                                  message.sender === 'customer' ? 'text-gray-500' : 'text-purple-100'
                                }`}>
                                  {message.timestamp}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent"
                            />
                            <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg transition-colors">
                              Send
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Select a conversation to start chatting</p>
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

export default function Chat() {
  return (
    <SidebarProvider>
      <ChatContent />
    </SidebarProvider>
  );
} 