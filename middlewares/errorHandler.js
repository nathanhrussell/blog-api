export function errorHandler(err, req, res, next) {
    console.error("Server error:", err);

    if (res.headersSent) return next(err);

    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ error: message });
}