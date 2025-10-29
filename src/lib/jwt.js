import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export function signAccessToken(payload) {
  return jwt.sign(payload, accessSecret, { expiresIn: Number(process.env.JWT_ACCESS_EXPIRES || 900) });
}
export function signRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: Number(process.env.JWT_REFRESH_EXPIRES || 1209600) });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret);
}
export function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret);
}
