const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

module.exports.createToken = async (payload) => {
    try {
        const options = { expiresIn: process.env.JWT_EXPIRY_TIME }
        const token = await jwt.sign(payload, secretKey, options);
        const modifiedToken = "Bearer "+token;
        return modifiedToken;
    }
    catch (err) {
        console.error("Error creating JWT", err);
        return null;
    }
}

module.exports.verifyToken = async (t) => {
    try {
        const token = t.split(' ')[1];
        const decoded = await jwt.verify(token, secretKey);
        console.log(convertTimestampsToIST(decoded));
        return decoded;
    }
    catch (err) {
        console.error("JWT Verification failed", err.message);
        return null;
    }
}

const convertToIST = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toISOString().slice(0, 19).replace('T', ' ');
};

const convertTimestampsToIST = (timestamps) => {
    return {
        iat: convertToIST(timestamps.iat),
        exp: convertToIST(timestamps.exp)
    };
};
