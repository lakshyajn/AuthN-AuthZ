const mongoose= require('mongoose');
require('dotenv').config();

exports.connect=()=> {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{console.log("DB connected sucesssfully")
}).catch((err)=>{console.log("Connection Issue");
    console.log(err);
    process.exit(1);
});
}