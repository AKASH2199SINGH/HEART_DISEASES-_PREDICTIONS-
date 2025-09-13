import React from "react";

const ChatIcon = ({ size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    style={{ borderRadius: "75%" }}
    aria-label="Open chat"
  >
    <circle cx="24" cy="24" r="24" fill="#075f71ff" />
    <path
      d="M14 32V18C14 16.8954 14.8954 16 16 16H32C33.1046 16 34 16.8954 34 18V30C34 31.1046 33.1046 32 32 32H18L14 36V32Z"
      fill="white"
    />
  </svg>
);
export default ChatIcon;
