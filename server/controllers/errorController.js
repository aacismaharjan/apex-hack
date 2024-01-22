const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
    if(req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.rstack,
        });
    }

    console.log("error", err);

    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: err.message,
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    sendErrorDev(err, req, res);
}