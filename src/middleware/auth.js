import { verifyAccessToken } from "../lib/jwt.js";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: { message: "Missing token" } });

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // { sub: userId, role: 'employee'|'customer', email }
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: { message: "Invalid or expired token" } });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, error: { message: "Unauthenticated" } });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: { message: "Forbidden" } });
    }
    next();
  };
}
