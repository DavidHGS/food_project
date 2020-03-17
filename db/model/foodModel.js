var mongoose=require("mongoose")

var foodSchema=new mongoose.Schema({
    name:{type:String,require:true},
    price:{type:String,require:true},
    desc:{type:String,require:true},
    typename:{type:String,required:true},
    typeid:{type:Number,required:true},
    img:{type:String,required:true},     
})

var food=mongoose.model("foods",foodSchema)

module.exports=food