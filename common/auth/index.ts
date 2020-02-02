const jwt = require('jsonwebtoken');

export const signToken = (payload: any) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED_ID });
    return token
}