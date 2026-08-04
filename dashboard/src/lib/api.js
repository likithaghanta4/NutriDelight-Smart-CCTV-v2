const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://nutridelight-backend.onrender.com"
).replace(/\/$/, "");
const AI_STREAM_BASE_URL = (
  import.meta.env.VITE_AI_STREAM_BASE_URL ||
  "https://bar-original-humanity-michelle.trycloudflare.com"
).replace(/\/$/, "");

export const apiEndpoints = {
  detections: `${API_BASE_URL}/api/detections`,
  visitorAnalytics: `${API_BASE_URL}/api/visitor-analytics`,
  vehicleAnalytics: `${API_BASE_URL}/api/vehicle-analytics`,
  vehicleHourlyAnalytics: `${API_BASE_URL}/api/vehicle-analytics/hourly`,
  ownerLiveStream: `${API_BASE_URL}/api/owner/live-stream`,
};

export const getShopStreamUrl = () => `${AI_STREAM_BASE_URL}/video-feed`;

export const getOwnerStreamUrl = (accessToken) => {
  if (!accessToken) {
    return "";
  }

  const encodedToken = encodeURIComponent(accessToken);
  return `${apiEndpoints.ownerLiveStream}?access_token=${encodedToken}`;
};
