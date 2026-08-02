const supabase = require("../config/supabase");
const env = require("../config/env");

const resolveAccessToken = (req) => {
  const authHeader = req.headers.authorization || "";

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const tokenFromQuery = req.query.access_token;
  if (typeof tokenFromQuery === "string" && tokenFromQuery.trim().length > 0) {
    return tokenFromQuery.trim();
  }

  return "";
};

const requireOwnerAuth = async (req, res, next) => {
  try {
    const accessToken = resolveAccessToken(req);

    if (!accessToken) {
      return res.status(401).json({
        message: "Owner authentication token is required",
      });
    }

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data?.user) {
      return res.status(401).json({
        message: "Invalid or expired owner token",
      });
    }

    const ownerEmail = (env.ownerEmail || "").toLowerCase();
    const userEmail = (data.user.email || "").toLowerCase();

    if (ownerEmail && userEmail !== ownerEmail) {
      return res.status(403).json({
        message: "Authenticated user is not authorized for owner access",
      });
    }

    req.owner = data.user;
    return next();
  } catch (error) {
    return res.status(500).json({
      message: "Failed to validate owner authentication",
      error: error.message,
    });
  }
};

module.exports = requireOwnerAuth;
