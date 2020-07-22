const userDao = require('../service/user_dao')
const md5 = require('../util/md5.js')
const jwt = require('jsonwebtoken')
const uuid = require('node-uuid')

module.exports = {

    logout:async(ctx,next) => {  //退出登录
        ctx.logout() //删除用户session
        await ctx.render('login',{error:''})
    },

    postlogin:async(ctx) => {  //用户验证登录
        const data = ctx.request.body
        //查询用户
        const user = await userDao.getUserInfo(data.userid)
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

    userinfo:async(ctx,next)=>{  //获取用户登录信息
        ctx.body = {
            data:{
                message: '用户信息',
                user:ctx.state.user,
            }
        };
    },
    registerinfo:async(ctx,next)=>{  //注册新用户
        let solt = uuid.v4()
        let {username,userid,password} = ctx.request.body
        let md5password = await md5.MD5(password,solt)
        let user = await userDao.getUserInfo(userid)
        if(!user){
            await userDao.addUser(username,userid,md5password,solt)
            ctx.body={
                code:1,
                message:'注册成功'
            }
        }
        else{
            ctx.body={
                code:-1,
                message:'用户已存在'
            }
        }
    },


    
    sharebooks:async(ctx,next)=>{ //users用户分享食谱  
        let {title,userid,making,tags,context} = ctx.request.body
        if(tags.length>0){
            let tag=''
            tags.forEach(item=>{
                tag += item+','
            })
            await userDao.shareBook(title,tag,userid,making)
            ctx.body={message:'成功'}
        }
        if(tags.length==0){
            await userDao.shareBook(title,context,userid,making)
            ctx.body={message:'成功'}
        }
        
    },
    readcookbook:async(ctx,next) => {   //首页食谱列表获取
        let randomnum = parseInt(Math.random()*30+15) 
        let data = await userDao.getbooks(randomnum)
        ctx.body = {
            data:data,
        }
    },
    readdetail:async(ctx,next)=>{  //食谱详情页
        let title = ctx.request.body.title
        let userid = ctx.request.body.userid
        let data = await userDao.readdetail(title,userid)
        ctx.body={
            data:data
        }
    },
    mybooks:async(ctx,next)=>{   //用户自己上传的食谱查看
        let userid = ctx.request.body.userid
        let data=await userDao.mybooks(userid)
        ctx.body={message:'success',data:data}
    },
    searchgood:async(ctx,next)=>{  //上传食谱页搜索商品
        let {goodname} = ctx.request.body
        let goods = await userDao.searchgood(goodname)
        if(goods){
            ctx.body={code:1,data:goods}
        }
        else{
            ctx.body={code:0,message:'暂无此商品'}
        }
    },
    getgoodinfo:async(ctx,next)=>{  //获取商品详情
        let id = ctx.request.body.id
        let info = await userDao.getgoodinfo(id)
        ctx.body={data:info}
    },
    addaddress:async(ctx,next)=>{   //添加地址
        let {userid,address,pca,conphone} = ctx.request.body
        let add = address
        let province = pca[0]
        let city = pca[1]
        let area = pca[2]
        let adds = await userDao.addAddress(userid,province,city,area,add,conphone)
        if(add){
            ctx.body={message:'添加成功',code:1}
        }
        else{
            ctx.body={message:'添加失败',code:-1}
        }
    },
    addlist:async(ctx,next)=>{  //获取用户地址列表
        let userid = ctx.request.body.userid
        let adds = await userDao.addList(userid)
        ctx.body={data:adds}
    },
    deladd:async(ctx,next)=>{  ///删除地址
        let id = ctx.request.body.id
        let data = await userDao.delAdd(id)
        if(data){
            ctx.body={code:1}
        }
        else{
            ctx.body={code:-1}
        }
    },
    addcarlist:async(ctx,next)=>{   //添加到购物车
        let {userid,goodid,goodnum,selected} = ctx.request.body
        let data = await userDao.addcarlist(userid,goodid,goodnum,selected)
        ctx.body={data:data}
    },
    updatecarlist:async(ctx,next)=>{  //用户在购物车更改商品数量时数据的更新
        let body= ctx.request.body
        let userid= body.userid
        let goodid = body.goodid
        let goodnum = body.goodnum
        let data = await userDao.updatecarlist(goodnum,userid,goodid)
        ctx.body={data:data}

    },
    clearcarlist:async(ctx,next)=>{  //清空购物车
        let {userid} = ctx.request.body
        let data =await userDao.clearcarlist(userid)
        if(data){
            ctx.body={code:1}
        }
        
    },
    setbookgoods:async(ctx,next)=>{   //上传页面搜索完商品从返回的商品列表中选择商品并存入数据库
        let body = ctx.request.body
        let {goodid,cbtitle,userid} = ctx.request.body
        let goodname = body.goodname
        let data = await userDao.setbookgoods(goodid,userid,cbtitle,goodname)
        ctx.body={data:data}
    },
    getbookgoods:async(ctx,next)=>{   //获取食谱详情页底部商品列表
        let body =ctx.request.body
        let title = body.title
        let userid = body.userid
        let data = await userDao.getbookgoods(title,userid)
        ctx.body={data:data}
    },
    goodlist:async(ctx,next)=>{  //通过id获取商品详情
        let body = ctx.request.body
        let goodid = body.goodid
        console.log(ctx.request.body)
        let data = await userDao.goodlist(goodid)
        ctx.body={data:data}
    },
    getcarinfo:async(ctx,next)=>{  //获取购物车信息，可用于判断能否加入购物车
        let {userid} = ctx.request.body
        let data = await userDao.getcarinfo(userid)
        ctx.body={data:data}
    },
    selected:async(ctx,next)=>{  //购物车商品是否勾选
        let { userid, goodid}=ctx.request.body
        let data = userDao.selected(userid,goodid)
        ctx.body={message:'success'}
    },
    allunselected:async(ctx,next)=>{   //用于离开或刷新购物车后购物车商品不被勾选
        let { userid}=ctx.request.body
        let data = userDao.allunselected(userid)
        ctx.body={message:'success'}
    },
    unselected:async(ctx,next)=>{
        let { userid, goodid}=ctx.request.body
        let data = userDao.unselected(userid,goodid)
        ctx.body={message:'success'}
    },
    getorder:async(ctx,next)=>{      ////确认订单页面获取用户下单信息
        let {userid} = ctx.request.body
        let data = await userDao.getorder(userid)
        ctx.body={
            data:data
        }
    },
    getAdress:async(ctx,next)=>{   //获取全部地址
        let {userid} = ctx.request.body
        let data = await userDao.getAdress(userid)
        ctx.body={data:data}
    },
    delcart:async(ctx,next)=>{    //删除购物车勾选商品
        let data = await userDao.delcart()
        if(data){
            ctx.body={code:1}
        }else{ctx.body={code:0}}
    },
    createbill:async(ctx,next)=>{   //创建订单
        let {orderid,goodid,userid,foodname,ordernum,address,storeid,total,conphone} = ctx.request.body
        let data = await userDao.createbill(orderid,goodid,userid,foodname,ordernum,address,storeid,total,conphone)
        if(data){ctx.body={code:1}}else{ctx.body={code:-1}}
    },
    paybill:async(ctx,next)=>{  //支付订单
        let {orderid,userid} = ctx.request.body
        let data = await userDao.paybill(orderid,userid,)
        if(data){ctx.body={code:1,data:data}}else{ctx.body={code:-1}}
    },
    getpayed:async(ctx,next)=>{  //获取已支付订单
        let {userid} = ctx.request.body
        let data = await userDao.getpayed(userid)
        ctx.body={data:data}
    },
    getpaying:async(ctx,next)=>{  //获取待支付订单
        let {userid} = ctx.request.body
        let data = await userDao.getpaying(userid)
        ctx.body={data:data}
    },
    cancelorder:async(ctx,next)=>{  //取消订单
        let {orderid,userid,ordernum,goodid} = ctx.request.body
        let data = await userDao.cancelorder(orderid,userid,ordernum,goodid)
        if(data){
            ctx.body={message:'success',code:1}
        }else{
            ctx.body={message:'fail',code:-1}
        }
        
    },
    gettakenorder:async(ctx,next)=>{  //获取已接单订单
        let {userid} = ctx.request.body
        let data = await userDao.gettakenorder(userid)
        if(data){
            ctx.body={code:1,data:data}
        }else{
            ctx.body={code:0,message:'无'}
        }
    },
    getsellerinfo:async(ctx,next)=>{  //获取商家页面商家信息
        let {storeid} = ctx.request.body
        let data = await userDao.getsellerinfo(storeid)
        if(data){ctx.body={code:1,data:data}}else{ctx.body={code:0}}
    },
    getallgoods:async(ctx,next)=>{    //获取商家全部商品
        let {userid} = ctx.request.body
        let data = await userDao.getallgoods(userid)
        if(data){ctx.body={code:1,data:data}}else{ctx.body={code:0}}
    },
    searchbook:async(ctx,next)=>{   //搜索食谱
        let { bookname } = ctx.request.query
        let data = await userDao.searchbook(bookname)
        ctx.body={data:data}
    },
    getallorders:async(ctx,next)=>{
        let {userid } = ctx.request.body
        let data = await userDao.getallorders(userid)
        ctx.body = {data:data}
    },
    getCancelorders:async(ctx,next)=>{
        let {userid } = ctx.request.body
        let data = await userDao.getCancelorders(userid)
        ctx.body = {data:data}
    },
    orderdetail:async(ctx,next)=>{
        let {orderid} = ctx.request.body
        let data = await userDao.orderdetail(orderid)
        ctx.body = {data:data}
    }
}