export function notFound(req, res, next) {
  res.status(404).json({
    ok: false,
    error: { message: "Route not found" }
  });
}
