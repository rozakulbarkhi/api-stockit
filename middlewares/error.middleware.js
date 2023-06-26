import ResponseError from "../error/response-error.js";

const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof ResponseError) {
    return res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  } else if (err.message.includes("E11000")) {
    return res.status(400).json({
      status: false,
      message: "This name already exists",
    });
  } else if (err.message.includes("Cast to Number failed")) {
    return res.status(400).json({
      status: false,
      message: "This inputs must be a number",
    });
  } else {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export default errorMiddleware;
