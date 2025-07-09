export function formatResponse(req, res, next) {
  const oldJson = res.json;
  res.json = (data) => {
    oldJson.call(res, {
      success: true,
      data
    });
  };
  next();
}
