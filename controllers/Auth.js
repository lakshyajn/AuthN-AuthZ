const bycrypt = require('bcrypt');
const User= require("../Model/user")

//signup
exports.signup= async (req,res) =>{
    try{
        //get data
        const {name,email,passsword,role}= req.body;
        //check if user already exist
        const existUser= await User.findOne({email});

        if(existUser){
            return res.status(400).json({
                success:false,
                message:'User already exist',
            });
        }
        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bycrypt.hash(passsword,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'Error hashing password',  
            });
        }

        //create entry for user
        const user= await User.create({
            name,email,passsword:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:'User created successfully',
        });
    }
    catch(err){
       console.log(err);
       return res.status(500).json({
        success:false,
        message:'Error creating user',
    });
}
}