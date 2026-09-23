const decodeJWT = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const isJWTValid = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp && decoded.exp > currentTime;
};

export const getUserInfoFromJWT = (token) => {
  const decoded = decodeJWT(token);
  return decoded;
};
