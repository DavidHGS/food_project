var mongoose=require("mongoose")
mongoose.connect("mongodb://localhost/noob",{useNewUrlParser: true,useUnifiedTopology: true})

var db=mongoose.connection

db.on("err",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("数据库连接成功")
})