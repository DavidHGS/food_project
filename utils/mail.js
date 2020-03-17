"use strict";
const nodemailer = require("nodemailer");


//创建要发送邮件的对象
let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "2508808197@qq.com", // 发送方邮件地址
        pass: "dmqxexxcbaxsecga" // smtp验证码
    }
});



//封装模块
function send(mail,code){
    //邮件信息
    let mailobj = {
        from: '"大帅B" <2508808197@qq.com>', // sender address
        to: mail, // list of receivers
        subject: "noob", // Subject line
        text: `您的验证码是${code}，有效期五分钟`, // plain text body
        // html: "<b>Hello world?</b>" // html body 文本和网页只能有一个
    }
    return new Promise((resolve,reject)=>{
        //发送邮件                  
        transporter.sendMail(mailobj,(err,data)=>{
            if(!err){
                resolve()
            }else{
                reject()
            }
        });
    })
    
}

module.exports={send}