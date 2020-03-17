const express=require("express")
const app=new express()
const path=require("path")
const db=require("./db/connect")
const bodyparser=require("body-parser")

//采用表单验证
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use("/public",express.static(path.join(__dirname,"./static")))
app.use("/",express.static(path.join(__dirname,"./static/html")))

var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(1111)
  //这里就是生成你默认页面的代码
  //下面这句的意思是用一个叫做index的模板生成页面
  res.render('login.html');
});

//路由
var foodRouter=require("./router/foodRouter")
var userRouter=require("./router/userRouter")
var fileRouter=require("./router/fileRouter")
var routes = require('./router/index');
app.use("/user",userRouter)
app.use("/food",foodRouter)
app.use("/file",fileRouter)
app.use('/', routes);


app.listen(3000,()=>{
    console.log("server start")
})