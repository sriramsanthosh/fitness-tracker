const bcrypt = require('bcrypt');

module.exports.hashPassword = async(password)=> {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        return null;
    }
}

module.exports.verifyPassword = async(password, hashedPassword)=>{
    try {
        // Compare the password with the hashed password
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}