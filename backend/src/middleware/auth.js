export function requireBearerToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  req.userToken = authHeader.slice("Bearer ".length).trim();
  if (!req.userToken) {
    return res.status(401).json({ error: "Invalid Bearer token" });
  }

  next();
}
