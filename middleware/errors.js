module.exports = {
  notFound: async (req, res, next) => {
    const error = new Error("Not Found ");
    error.status = 404;
    next(error);
  },

  internalServerError: async (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  },
};
