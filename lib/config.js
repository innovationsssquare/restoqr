// Dynamic API Base URL resolver for Localhost, Wi-Fi LAN, Tunnel & Production
export const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname || "localhost";
    return `http://${host}:8081/api/v1`;
  }
  return "http://localhost:8081/api/v1";
};

