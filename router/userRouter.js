var express=require("express")
var router=express.Router()
var user=require("../db/model/userModel")
const Mail=require("../utils/mail")

//通过内存保存code
let codes={}

/**
 * @api {post} /user/reg 用户注册
 * @apiName 用户注册
 * @apiGroup User
 *
 * @apiParam {String} us   用户名.
 * @apiParam {String} ps   用户密码.
 * @apiParam {String} mail 注册邮箱.
 * @apiParam {String} code 验证码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post("/reg",(req,res)=>{
    let {us,ps,mail,code}=req.body
    if(!us||!ps||!ps){
        res.send({err:-1,msg:"参数错误"})
    }else{
        if(code!=codes[mail]) {return res.send({err:-4,msg:"验证码错误"})}
        user.find({us}).then((data)=>{
            if(data.length>0){
                //用户名重复
                res.send({err:-3,msg:"用户名重复"})
            }else{
                return user.insertMany({us:us,ps:ps})
            }
        })
        .then(()=>{
            res.send({err:0,msg:"注册成功"})
        })
        .catch((err)=>{
            res.send({err:-2,msg:"注册失败"})
        })
    }
})

/**
 * @api {post} /user/login 用户登录
 * @apiName 用户登录
 * @apiGroup User
 *
 * @apiParam {String} us   用户名.
 * @apiParam {String} ps   用户密码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post("/login",(req,res)=>{
    let {us,ps}=req.body
    if(!us||!ps){
        res.send({err:-1,msg:"参数错误"})
    }else{
        user.find({us:us,ps:ps}).then((data)=>{
            if(data.length>0){
                res.send({err:0,msg:"登录成功"})
            }else{
                res.send({err:-2,msg:"用户名或密码不正确"})
            }
        })
        .catch((err)=>{
            res.send({err:-1,msg:"内部错误"})
        })
    }
})

/**
 * @api {post} /user/getMailCode 发送邮箱验证码
 * @apiName 发送邮箱验证码
 * @apiGroup User
 *
 * @apiParam {String} mail 注册邮箱.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post("/getMailCode",(req,res)=>{
    let {mail}=req.body
    let code=parseInt(Math.random()*10000)
    Mail.send(mail,code).then(()=>{
        //将邮箱和匹配的验证码存储在内存中
        codes[mail]=code
        res.send({err:0,msg:"验证码发送 ok"})
    })
    .catch(()=>{
        res.send({err:-1,msg:"验证码发送 no ok"})
    })
})

module.exports=router