const jwt = require('jsonwebtoken');
const jwtPassword = 'secret';
const express = require('express')

const app = express()

const ALL_USERS = [
    {
        username: 'sjranju@gmail.com',
        password: '123',
        name: 'Ranjana Singanoodi'
    },
    {
        username: 'rmujum@gmail.com',
        password: '123321',
        name: 'Ranjan Mujumdar'
    },
    {
        username: 'srajani@gmail.com',
        password: '12345678',
        name: 'Rajani'
    },

]
/**
 * Generates a JWT for a given username and password.
 *
 * @param {string} username - The username to be included in the JWT payload.
 *                            Must be a valid email address.
 * @param {string} password - The password to be included in the JWT payload.
 *                            Should meet the defined length requirement (e.g., 6 characters).
 * @returns {string|null} A JWT string if the username and password are valid.
 *                        Returns null if the username is not a valid email or
 *                        the password does not meet the length requirement.
 */
function signJwt(username, password) {
    const signedUser = ALL_USERS.find(user => user.username === username && user.password === password)
    if (signedUser) {
        const signedJWT = jwt.sign({ username: username }, jwtPassword)
        return signedJWT
    }
    return null
}

app.post('/signin', (req, res) => {
    const jwtoken = signJwt(req.headers.username, req.headers.password)
    res.status(200).json({ token: jwtoken })
})

/**
 * Verifies a JWT using a secret key.
 *
 * @param {string} token - The JWT string to verify.
 * @returns {boolean} Returns true if the token is valid and verified using the secret key.
 *                    Returns false if the token is invalid, expired, or not verified
 *                    using the secret key.
 */
function verifyJwt(token) {
    const verifiedJWT = jwt.verify(token, jwtPassword)
    return verifiedJWT.username ? true : false
}

/**
 * Decodes a JWT to reveal its payload without verifying its authenticity.
 *
 * @param {string} token - The JWT string to decode.
 * @returns {object|false} The decoded payload of the JWT if the token is a valid JWT format.
 *                         Returns false if the token is not a valid JWT format.
 */
function decodeJwt(token) {
    const decodedJWT = jwt.decode(token)
    return decodedJWT ? decodedJWT : false
}

app.get('/users', (req, res) => {
    const token = req.headers.authorization
    const decodedResponse = decodeJwt(token)
    console.log(decodedResponse)
    const response = verifyJwt(token)
    if (response) {
        res.status(200).json(ALL_USERS.filter(user => user.username !== response.username))
    }
    else {
        res.status(404).json({
            'msg': 'Not Found'
        })
    }
})

app.listen(3002)

module.exports = {
    signJwt,
    verifyJwt,
    decodeJwt,
    jwtPassword,
};
