var express=require("express")
var router=express.Router()
const multer=require("multer")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/img')
    },
    filename: function (req, file, cb) {
      let exts=file.originalname.split(".")
      let ext=exts[exts.length-1]
      let tmpname=new Date().getTime()+parseInt(Math.random(0,1)*9999)
      cb(null, `${tmpname}.${ext}`)
    }
  })
   
var upload = multer({ storage: storage })


router.post("/upload",upload.single("hehe"),(req,res)=>{
    let {size,mimetype,path}=req.file
    let types=["jpg","jpeg","png","gif"]//允许上传类型
    let tmpType=mimetype.split("/")[1]
    if(size>=500*1024){
        return res.send({err:-1,msg:"图片尺寸过大"})
    }else if(types.indexOf(tmpType)==-1){
        return res.send({err:-2,msg:"图片格式不对"})
    }else{
        let url=`/public/img/${req.file.filename}`
        res.send({err:0,msg:"upload ok",img:url})
    }
})
module.exports=router