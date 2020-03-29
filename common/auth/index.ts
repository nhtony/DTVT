const jwt = require('jsonwebtoken');

export const signToken = (payload: any, expiresIn: string) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token
}