var express=require("express")
var router=express.Router()
var foodModel=require("../db/model/foodModel")

/**
 * @api {post} /food/add 菜品添加
 * @apiName 菜品添加
 * @apiGroup Food
 *
 * @apiParam {String} name   菜名.
 * @apiParam {String} price   价格.
 * @apiParam {String} desc   描述.
 * @apiParam {String} typename 类型.
 * @apiParam {Number} typeid 类型id.
 * @apiParam {String} img 图片路径.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post("/add",(req,res)=>{
    // let data={
    //     name:"粉蒸肉",
    //     price:"9999",
    //     desc:"超好吃",
    //     typename:"蒸菜",
    //     typeid:2,
    //     img:"/public/img/timg.jpg"
    // }
    let {name,price,desc,typename,typeid,img}=req.body//结构化复制
    foodModel.find({name}).then((data)=>{
        if(data.length>0){
            res.send({err:-2,msg:"name 重复"})
        }else{
            return foodModel.insertMany({name,price,desc,typename,typeid,img})
        }
    })        
   .then(()=>{
        res.send({err:0,msg:"添加成功"})
    })
    .catch((err)=>{
        console.log(err)
        res.send({err:-1,msg:"添加失败"})
    })
})

/**
 * @api {post} /food/getInfoByTypeid 分类查询
 * @apiName 分类查询
 * @apiGroup Food
 *
 * @apiParam {Number} typeid 类型id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post("/getInfoByTypeid",(req,res)=>{
    let {typeid}=req.body
    if(req.body.typeid==0){
        foodModel.find().then((data)=>{
            res.send({err:0,msg:"查询ok",list:data})
        })
    }else{
        foodModel.find({typeid}).then((data)=>{
            res.send({err:0,msg:"查询ok",list:data})
        }) 
        .catch(()=>{
            res.send({err:-1,msg:"查询失败"})
        })
    }    
})


/**
 * @api {post} /food/getInfoByKw 关键字查询
 * @apiName 关键字查询
 * @apiGroup Food
 *
 * @apiParam {String} kw 菜名or描述关键字.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/getInfoByKw",(req,res)=>{
    // $set $gte $or $and $regex $regexp
    let {kw}=req.body
    let reg=new RegExp(kw)//创建一个正则表达式 匹配关键字
    //foodModel.find({name:{$regex:reg})
    foodModel.find({$or:[{name:{$regex:kw}},{desc:{$regex:kw}}]}).then((data)=>{
        if(data.length>0){
            res.send({err:0,msg:"查询ok",list:data})
        }else{
            res.send({err:-2,msg:"NULL"})
        }
    })
    .catch(()=>{
        res.send({err:-1,msg:"查询失败"})
    })
    }   
)

/**
 * @api {post} /food/del 删除
 * @apiName 删除
 * @apiGroup Food
 *
 * @apiParam {String} _id 主键_id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post("/del",(req,res)=>{
    let {_id}=req.body
    foodModel.deleteMany({_id}).then((data)=>{
        res.send({err:0,msg:"删除ok",list:data})
    })
    .catch(()=>{
        res.send({err:-1,msg:"删除失败"})
    })
})


/**
 * @api {post} /food/update 修改菜品
 * @apiName 修改菜品
 * @apiGroup Food
 *
 * @apiParam {String} name   修改菜名.
 * @apiParam {String} price   修改价格.
 * @apiParam {String} desc   修改描述.
 * @apiParam {String} typename 修改类型.
 * @apiParam {Number} typeid 修改类型id.
 * @apiParam {String} img 修改图片路径.
 * @apiParam {String} _id 需要修改的菜品_id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/update",(req,res)=>{
    let {name,price,desc,typename,typeid,img,_id}=req.body//结构化复制
    foodModel.updateOne({_id},{name,price,desc,typename,typeid,img}).then((data)=>{
        res.send({err:0,msg:"更新ok",list:data})
    })
    .catch(()=>{
        res.send({err:-1,msg:"更新失败"})
    })
})


/**
 * @api {post} /food/getInfoById 菜品_id查询
 * @apiName 主键_id查询
 * @apiGroup Food
 *
 * @apiParam {Number} _id 主键_id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/getInfoById",(req,res)=>{
    let {_id}=req.body
    foodModel.find({_id}).then((list)=>{
        if(list.length>0){
            res.send({err:0,msg:"查询成功",list})
        }else{
            res.send({err:-2,msg:"查询无结果",list})
        }
    })
    .catch((err)=>{
        res.send({err:-1,msg:"查询失败"})
    })
})

/**
 * @api {post} /food/getInfoByPage 分页查询
 * @apiName 分页查询
 * @apiGroup Food
 *
 * @apiParam {Number} pagesize 每页数据条数.
 * @apiParam {Number} page 页数.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/getInfoByPage",(req,res)=>{
    let pageSize=req.body.pagesize||2//设置默认值
    let page=req.body.page||1
    let count=0
    foodModel.find().then((list)=>{
        count=list.length
        return foodModel.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
    })
    .then((data)=>{
        let allPage=Math.ceil(count/pageSize)
        res.send({err:0,msg:"查找ok",info:{list:data,count,allPage}})
    })
    .catch(()=>{
        res.send({err:-1,msg:"查找失败"})
    })
})

module.exports=router