const bycrypt = require('bcrypt');
const User= require("../Model/user")
const jwt = require('jsonwebtoken');
require("dotenv").config();

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

//login
exports.login= async (req,res) =>{
    try{
        //data fetch
        const {email,passsword}= req.body;
        //validation on email and password
        if(!email || !passsword){
            return res.status(400).json({
                success:false,
                message:'Please provide email and password',
    });}

    //check for registered users
    const user= await User.findOne({email});
    //if not a registered user
    if(!user){
        return res.status(404).json({
            success:false,
            message:'User not found',
    });
    }

  const payload= {
    email: user.email,
    id:user.id,
    role:user.role,
  };

     //verify password & generate a JWT token
     if(await bycrypt.compare(passsword,user.passsword)){
         //password matches
         let token= jwt.sign(payload,process.env.JWT_SECRET,{expiresIn
            :'1h'});
        user.token= token;
        user.passsword= undefined;
        const options={
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("token",token,options)
            .status(200).json({
                success:true,
                message:'Login successful',
     });
    }
     else{
        //password do not match
        return res.status(401).json({
            success:false,
            message:'Invalid password',
     });
    }

}   
  catch(error){
    console.error(error);
    res.status(500).json({
        success:false,
        message:'Internal Server Error',
   });
   }

}