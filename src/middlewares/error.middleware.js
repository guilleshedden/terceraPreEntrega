const { Error } = require("../utils/customError/Errors");

exports.errorHandler = (error, req, res, next) =>{
    console.log(error.cause)
    switch (error.code) {
        case Error.INVALID_TYPE_ERROR:
            return res.send({status: "error", error: error.name})
            break;
    
        default:
            return res.send({status: "error", error: "unhandled error"})
            break;
    }
}