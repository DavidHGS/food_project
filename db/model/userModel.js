var mongoose=require("mongoose")

var userSchema=new mongoose.Schema({
    us:{type:String,require:true},
    ps:{type:String,require:true},
    age:{type:Number},
    sex:{type:Number,default:0}
})

var user=mongoose.model("user",userSchema)

module.exports=user