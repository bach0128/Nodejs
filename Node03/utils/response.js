module.exports = {
  successResponse: (res, status, message, data) => {
    const response = {
      status,
      message,
      data,
    };
    return res.status(response.status).json(response);
  },
  errorResponse: (res, status, message, data) => {
    const response = {
      status,
      message,
      data,
    };
    return res.status(response.status).json(response);
  },
};
