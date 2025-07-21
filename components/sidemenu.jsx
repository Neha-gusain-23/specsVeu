import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSidebar } from "../context/SidebarContext";
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
function encryptToken(ci, aid) {
  const data = JSON.stringify({ ci, aid });
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

const menuItems = [
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="2"
          fill="none"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="2"
          fill="none"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="2"
          fill="none"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="2"
          fill="none"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Products",
    route: "/products",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect
          x="3"
          y="7"
          width="18"
          height="13"
          rx="2"
          fill="none"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <rect
          x="7"
          y="3"
          width="10"
          height="4"
          rx="2"
          fill={isActive ? "#a259f7" : "#fff"}
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Orders",
    route: "/orders",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 6h18M3 6l1.5 14h15L21 6M16 10a4 4 0 11-8 0"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Users",
    route: "/users-permissions",
    icon: (isActive) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#a259f7"
          fillOpacity={isActive ? 1 : 0.1}
          d="M9.99296258,10.5729355 C12.478244,10.5729355 14.4929626,8.55821687 14.4929626,6.0729355 C14.4929626,3.58765413 12.478244,1.5729355 9.99296258,1.5729355 C7.5076812,1.5729355 5.49296258,3.58765413 5.49296258,6.0729355 C5.49296258,8.55821687 7.5076812,10.5729355 9.99296258,10.5729355 Z"
        />
        <path
          d="M10,0 C13.3137085,0 16,2.6862915 16,6 C16,8.20431134 14.8113051,10.1309881 13.0399615,11.173984 C16.7275333,12.2833441 19.4976819,15.3924771 19.9947005,19.2523727 C20.0418583,19.6186047 19.7690435,19.9519836 19.3853517,19.9969955 C19.0016598,20.0420074 18.6523872,19.7816071 18.6052294,19.4153751 C18.0656064,15.2246108 14.4363723,12.0699838 10.034634,12.0699838 C5.6099956,12.0699838 1.93381693,15.231487 1.39476476,19.4154211 C1.34758036,19.7816499 0.998288773,20.0420271 0.614600177,19.9969899 C0.230911582,19.9519526 -0.0418789616,19.6185555 0.00530544566,19.2523267 C0.500630192,15.4077896 3.28612316,12.3043229 6.97954305,11.1838052 C5.19718955,10.1447285 4,8.21217353 4,6 C4,2.6862915 6.6862915,0 10,0 Z"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "Reviews",
    route: "/reviews",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
          fill={isActive ? "#a259f7" : "none"}
        />
      </svg>
    ),
  },
  {
    label: "Banner & Coupons",
    route: "/banner-coupons",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect
          x="3"
          y="7"
          width="18"
          height="10"
          rx="2"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <path
          d="M7 7l5 5 5-5"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Inventory",
    route: "/inventory",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Notifications",
    route: "/notifications",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <path
          d="M13.73 21a2 2 0 01-3.46 0"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Newsletter",
    route: "/newsletter",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <polyline
          points="22,6 12,13 2,6"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Chat",
    route: "/chat",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    route: "/settings",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Logout",
    route: "/auth/login",
    icon: (isActive) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <polyline
          points="16,17 21,12 16,7"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
        <line
          x1="21"
          y1="12"
          x2="9"
          y2="12"
          stroke={isActive ? "#a259f7" : "#222"}
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

// Custom bounce animation for Tailwind
const bounceKeyframes = `
@keyframes bounce-custom {
  0%, 100% { transform: translateY(0); }
  20% { transform: translateY(-8px); }
  40% { transform: translateY(0); }
  60% { transform: translateY(-4px); }
  80% { transform: translateY(0); }
}
`;

// Animated underline for heading
const underlineKeyframes = `
@keyframes underline-move {
  0% { left: 0; width: 0; opacity: 1; }
  40% { left: 0; width: 100%; opacity: 1; }
  80% { left: 100%; width: 0; opacity: 0; }
  100% { left: 0; width: 0; opacity: 0; }
}
`;

export default function SideMenu({ mobileOverlay = false }) {
  const { isOpen, toggleSidebar } = useSidebar();
  const router = useRouter();
  // Get token from current query and decrypt
  const { token } = router.query;
  const { ci, aid } = decryptToken(token);

  // Determine sidebar width class
  const sidebarWidthClass = mobileOverlay
    ? "w-full"
    : isOpen
    ? "w-[270px]"
    : "w-16";

  return (
    <>
      <style>{bounceKeyframes + underlineKeyframes + `
  nav::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  nav::-webkit-scrollbar-thumb {
    background:rgb(167, 100, 234); /* Tailwind purple-500 */
    border-radius: 6px;
  }
  nav {
    scrollbar-color:rgb(183, 138, 235) transparent;
    scrollbar-width: thin;
  }
`}</style>

      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 bg-white shadow flex flex-col ${sidebarWidthClass} border-r border-gray-100`}
        style={{
          boxShadow: "2px 0 16px 0 rgba(162,89,247,0.15), 4px 0 0 0 #e0d7f8",
        }}
      >
        {/* Sidebar Title */}
        <div className="flex flex-col items-center justify-center py-8 border-b border-gray-200">
          <span className="text-2xl font-extrabold text-[#a259f7] tracking-wide">SPECS VIEW</span>
        </div>
        {/* Menu items */}
        <nav
          className={`flex-1 flex flex-col ${
            mobileOverlay
              ? ""
              : isOpen
              ? "gap-1 mt-3 px-2"
              : "gap-0 mt-2 px-0 items-center"
          }`}
          style={{
            overflowY: "auto",
            overflowX: "hidden", // Prevent horizontal scrollbar
            scrollbarWidth: "thin",
            maxHeight: "100vh"
          }}
        >
          {menuItems.map((item, idx) => {
            const isActive = router.pathname === item.route;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (ci && aid) {
                    const newToken = encryptToken(ci, aid);
                    router.push(`${item.route}?token=${encodeURIComponent(newToken)}`);
                  } else {
                    router.push(item.route);
                  }
                }}
                className={`flex items-center w-full my-1 rounded-xl transition-all duration-150 text-base font-medium
                  ${isActive ? "bg-[#f5edff] text-[#a259f7] shadow-sm" : "text-gray-700 hover:bg-gray-50"}
                  ${isOpen || mobileOverlay ? "px-5 py-3 gap-3 justify-start" : "justify-center px-0 py-3"}
                `}
                style={{
                  boxShadow: isActive ? "0 2px 8px 0 rgba(162,89,247,0.08)" : undefined,
                  minHeight: 48,
                }}
              >
                <span className={`text-xl flex-shrink-0 flex items-center justify-center ${isActive ? "" : "text-gray-400"}`}>{item.icon(isActive)}</span>
                {(isOpen || mobileOverlay) && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {/* Sidebar Avatar at Bottom */}
      </aside>
    </>
  );
}
