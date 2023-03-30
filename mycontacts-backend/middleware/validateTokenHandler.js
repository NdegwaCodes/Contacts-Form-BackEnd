const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');


const validateToken = asyncHandler(async(req,res, next) =>{
    let token;
    let authHeader = req.headersAuthorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ") [1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decoded) => {
            if(err) {
                res.status(401);
                throw new Error("Not Authorized, Token Failed");
            }
            req.user = decoded.user;
            next();
        });

        if(!token){
            res.status(401);
            throw new Error("Not Authorized, No Token");
        }
    }
});

module.exports = validateToken;