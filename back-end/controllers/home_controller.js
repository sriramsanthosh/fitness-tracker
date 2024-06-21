const { message } = require("antd");
const { hashPassword, verifyPassword } = require("../config/bcrypt");
const { verifyToken, createToken } = require("../config/jwt");
const { transporter } = require("../config/nodemailer");
const User = require("../models/User");
require("dotenv").config();

module.exports.home = (req, res) => {
    try {
        return res.status(200).json({
            message: "This is the home page, Server is up!"
        });
    }
    catch (err) {
        console.error("Error in rendering home", err);
        return res.status(500).json({
            message:"Error rendering home"
        });
    }
}

module.exports.register = async (req, res) => {
    try {
        const {user, credential} = req.body;
        const foundUser = await User.find({email:user.email});
        if(foundUser.length){
            const token = await createToken(foundUser[0].toJSON());
            return res.status(200).json({
                message:"Account already exists",
                token:token,
                user:{
                    displayName:foundUser[0].displayName,
                    email: foundUser[0].email,
                    photoURL:foundUser[0].photoURL,
                    weightArray:foundUser[0].weight
                }
            });
        }
        const userDetails = {
            displayName: user.displayName,
            email : user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            signinMethod: credential.signInMethod
        }
        const NewUser = await User.create(userDetails)
        console.log(NewUser);
        return res.state(200).json({
            message:"Account Created"
        });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


module.exports.addWeight = async(req, res)=>{
    try{
        console.log(req.body.currWeight);
        console.log(req.headers.token);
        const decoded = await verifyToken(req.headers.token);
        console.log(decoded);
        if(!decoded){
            return res.status(203).json({
                message:"Session Expired! Login Again"
            });
        }
        const date = new Date();
        const isoDateString = date.toISOString().split('T')[0];
        const currUser = await User.findOne({email:decoded.email});
        if(currUser.weight.length && currUser.weight[0].date === isoDateString){
            return res.status(203).json({
                message:"Today's weight already recorded! Come back tomorrow"
            })
        }
        await currUser.weight.push({date:isoDateString,weight:req.body.currWeight});
        await currUser.save();
        return res.status(200).json({
            message:"Added weight"
        });
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports.getWeight= async(req, res)=>{
    try{
        console.log(req.headers.token);
        const decoded = await verifyToken(req.headers.token);
        console.log(decoded);
        if(!decoded){
            return res.status(203).json({
                message:"Session Expired! Login Again"
            });
        }
        let userArray = [];
        const UserData = await User.find({}).sort({updatedAt:-1});
        // console.log(UserData, "userData");
        await UserData.map(async(item, index)=>{
            if(item.weight.length)
            await userArray.push({email:item.email, weight:item.weight[0].weight})
        })
        return res.status(200).json({
            weightArray: decoded.weight,
            userArray: userArray
        });
        
        

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
