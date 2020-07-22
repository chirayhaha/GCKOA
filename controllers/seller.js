const userDao = require('../service/user_dao')
const md5 = require('../util/md5.js')
const jwt = require('jsonwebtoken')
const uuid = require('node-uuid')

module.exports = {
    sellerinfo:async(ctx,next)=>{   //商家登录信息
        ctx.body = {
            data:{
                message: '用户信息',
                user:ctx.state.user,
            }
        };
    },
    findgoods:async(ctx,next)=>{   //检查商品是否已存在在数据库
        let body = ctx.request.body
        let goodname = body.goodname
        let goodnum = body.goodnum
        let goodprice = body.goodprice
        let userid = body.userid
        let data = await userDao.findgoods(goodname, goodnum, userid, goodprice)
        if(data){
            ctx.body={code:1}
        }else{
            ctx.body={code:-1}
        }
    },
    uploadgoods:async(ctx,next) => {  //上传商品
        let {goodname,goodnum,userid,goodprice} = ctx.request.body
        let goodinfo = await userDao.uploadgoods(goodname,goodnum,userid,goodprice)
        if(goodinfo){
            ctx.body={code:1,message:'上传成功'}
        }
        else{
            ctx.body={code:-1,message:'上传失败'}
        }
    },
    sregisterinfo:async(ctx,next)=>{  //商家注册
        let solt = uuid.v4()
        let {username,userid,password,storename,storephone,storeadd} = ctx.request.body
        let md5password = await md5.MD5(password,solt)
        let user = await userDao.getUserInfo(userid)
        if(!user){
            await userDao.saddUser(username,userid,md5password,solt) 
            await userDao.addSeller(storename,storephone,storeadd,userid)
            ctx.body={
                code:1,
                message:'注册成功'
            }
        }
        else{
            ctx.body={
                code:-1,
                message:'用户已存在',
            }
        }
    },
    spostlogin:async(ctx) => {  //商家登录
        const data = ctx.request.body
        //查询用户
        const user = await userDao.getSellerInfo(data.userid)
        //判断用户是否存在
        if(!user){
            //表示不存在该用户
            ctx.body = {
                code:-1,
                message:'该用户不存在'
            };
            return
        }
        //验证密码
        let md5pass = await md5.MD5(data.password,user.solt)
        if(md5pass === user.password){
            const payload = {
                userid:user.userid,
                username:user.username
            };
            //生成token
            const token = jwt.sign(payload,"hahaha",{ //元数据，密钥
                expiresIn:3600
            });
            ctx.status = 200;
            ctx.body = {
                code:1,
                data:{
                    message:'验证成功',
                    token:'Bearer '+token,
                    userid:user.userid
                }
            };
        }
        else{
            ctx.body = {
                code:0,
                data:{
                    message:'密码错误'
                }
            };
        }
    },
    gettaken:async(ctx,next)=>{  //获取已接单订单
        let {storeid} = ctx.request.body
        let data = await userDao.gettaken(storeid)
        ctx.body={data:data}
    },
    gettaking:async(ctx,next)=>{   //获取待接单订单
        let {storeid} = ctx.request.body
        let data = await userDao.gettaking(storeid)
        ctx.body={data:data}
    },
    takeOrder:async(ctx,next)=>{   //接单操作
        let {orderid,userid} = ctx.request.body
        let data = await userDao.takeOrder(orderid,userid)
        if(data){
            ctx.body={data:data,code:1}
        }
        else{
            ctx.body={data:data,code:-1}
        }
        
    },
    getCancel:async(ctx,next)=>{
        let {storeid } = ctx.request.body
        let data = await userDao.getCancel(storeid)
        ctx.body = {data:data}
    },

}