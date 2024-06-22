const express= require('express');
const router= express.Router();

const {login,signup}= require("../controllers/Auth");

router.post("/login",function(req, res){login});
router.post("/signup",function(req,res){signup});

module.exports= router;