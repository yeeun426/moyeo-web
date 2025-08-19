"use client";

import Image from "next/image";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

    if (!CLIENT_ID || !REDIRECT_URI) {
      console.error("Google OAuth configuration missing");
      return;
    }

    const SCOPE = "openid profile email";
    const RESPONSE_TYPE = "code";
    const STATE = crypto.randomUUID();

    localStorage.setItem("oauth_state", STATE);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(
      SCOPE
    )}&state=${STATE}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <button onClick={handleLogin}>
      <Image
        src="/images/google.png"
        alt="구글 로그인"
        width={40}
        height={40}
      />
    </button>
  );
};

export default GoogleLoginButton;
