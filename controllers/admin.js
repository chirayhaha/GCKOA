const userDao = require('../service/user_dao')
const md5 = require('../util/md5.js')
const jwt = require('jsonwebtoken')
const uuid = require('node-uuid')

module.exports = {
    all:async(ctx,next) => {  //获取全部普通用户信息
        let data = await userDao.getAllUser()
        await ctx.render('userinfo',{
            data:data
        })
    },
    alls:async(ctx,next) => {   ///获取全部商家信息
        let data = await userDao.getAllUsers()
        await ctx.render('userinfo',{data:data})
    },


    delete:async(ctx,next)=>{   //删除特定用户
        let userid=ctx.params.userid
        await userDao.delUser(userid)
        let data = await userDao.getAllUser()
        await ctx.render('userinfo',{
            data:data
        })
    },

    setadmin:async(ctx,next)=>{  //设为管理员
        let userid=ctx.params.userid
        await userDao.setAdmin(userid)
        let data = await userDao.getAllUser()
        await ctx.render('userinfo',{
            data:data
        })
    },

    openupload:async(ctx,next)=>{  //跳转upload页面
        let userInfo= ctx.state.user
        await ctx.render('upload',{userInfo:userInfo})
    },
    uploadbook:async(ctx,next) => {  //管理员上传食谱
        let data = ctx.request.body
        let context = data.context
        let title = data.title
        let making = data.making
        let userInfo= ctx.state.user
        let userid = userInfo.userid
        let res = await userDao.uploadbook(title,context,making,userid)
        await ctx.render('upload',{userInfo:userInfo})
    },
    ordersmanage:async(ctx,next) => {  //订单管理
        let orders= await userDao.getAllorders()
        await ctx.render('orders',{orders:orders})
    },
    Allbooks:async(ctx,next)=>{  //食谱管理
        let books = await userDao.getAllbooks()
        await ctx.render('cookbooks',{books:books})
    },
    delbooks:async(ctx,next)=>{   //删除食谱
        let id=ctx.params.id
        await userDao.delBooks(id)
        let books = await userDao.getAllbooks()
        await ctx.render('cookbooks',{books:books})
    },
    /* findUser:async(ctx,next)=>{  //查找用户
        let {info,roleid} = ctx.request.body
        let data = await userDao.findUser(info,roleid)
        if(data){
            ctx.body={search:data}
        }
        else{
            ctx.body = {message:'查询无结果'}
        }
    } */

}