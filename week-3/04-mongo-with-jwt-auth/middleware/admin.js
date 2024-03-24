const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../config")

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    try {
        const token = req.headers.authorization
        const words = token.split(' ')
        const jwtToken = words[1]
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET)
        if (decodedValue.username) {
            next()
        } else {
            res.status(403).json({
                'msg': 'You are not authenticated'
            })
        }
    } catch (e) {
        res.status(403).send("Incorrect inputs")
    }
}

module.exports = adminMiddleware;