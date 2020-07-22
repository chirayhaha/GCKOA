//建立数据库操作类，定义数据库操作类
const { user, cookbooks, orderlist, role, seller, goods, address, carlist, bookgoods } = require('../modules/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

//数据库操作类
class userDao {
    //静态方法，无需实例化可直接调用

    ///////////////////////用户管理员共用
    static async addUser(username, userid, password, solt) { //管理员添加用户，注册
        return await user.create({
            username: username,
            userid: userid,
            password: password,
            solt: solt,
            roleid: 1,
        })
    }

    ////////////////////////普通用户
    static async getUserInfo(userid) {   //获取用户信息，用于注册时检查是否已存在
        return await user.findOne({
            where: {
                userid,
                roleid: 1
            }
        })
    }
    static async shareBook(title, context, userid, making) { // 用户分享食谱
        return await cookbooks.create({
            title: title,
            context: context,
            userid: userid,
            making: making,
        })
    }
    static async getbooks(randomnum) {   //首页获取食谱列表
        return await cookbooks.findAll({
            include: {
                model: user,
                attributes: ['username']
            },
            attributes: ['title', 'context', 'userid'],

        })
    }
    static async readdetail(title, userid) {   //商品详情
        return await cookbooks.findOne({
            attributes: ['context', 'title', 'making'],
            where: {
                title: title,
                userid: userid
            }

        })
    }
    static async mybooks(userid) {  //用户上传的食谱查看
        return await cookbooks.findAll({
            where: {
                userid: userid
            }
        })
    }
    static async getgoodinfo(id) {  //商品详情页获取信息
        return await goods.findOne({
            where: {
                id: id,
            }
        })
    }
    static async addAddress(userid, province, city, area, add, conphone) {//添加地址
        return await address.create({
            add: add,
            userid: userid,
            province: province,
            city: city,
            area: area,
            conphone: conphone
        })
    }
    static async addList(userid) {//地址列表
        return await address.findAll({
            where: {
                userid: userid
            }
        })
    }
    static async delAdd(id) {//删除地址
        return await address.destroy({
            where: {
                id: id
            }
        })
    }
    static async addcarlist(userid, goodid, goodnum, selected) {  //添加购物车
        return await carlist.findOrCreate({
            where: {
                userid: userid,
                goodid: goodid,
            },
            defaults: {
                userid: userid,
                goodid: goodid,
                selected: selected,
                goodnum:goodnum,
            }
        }).then(res => {
            carlist.update({ goodnum: goodnum }, {
                where: {
                    userid: userid,
                    goodid: goodid,
                }
            })
        })
    }
    static async updatecarlist(goodnum, userid, goodid) {//购物车商品数量
        return await carlist.update(
            { goodnum: goodnum },
            {
                where: {
                    userid: userid,
                    goodid: goodid
                }
            })
    }
    static async clearcarlist(userid) {//清空购物车
        return await carlist.update(
            { goodnum: 0 }, {
            where: { userid: userid },
        }

        )
    }
    static async setbookgoods(goodid, userid, cbtitle, goodname) {  //上传页面选择已有商品插入食谱
        return await bookgoods.findOrCreate({
            where: {
                goodid: goodid,
                userid: userid,
                cbtitle: cbtitle,
                goodname: goodname
            },
            default: {
                goodid: goodid,
                userid: userid,
                cbtitle: cbtitle,
                goodname: goodname
            }
        })
    }
    static async getbookgoods(title, userid) {  //食谱商品列表
        return await bookgoods.findAll({
                where: {
                    cbtitle: title,
                    userid: userid
                }
            })
    }
    static async goodlist(goodid) {  //获取商品详情信息
        return await goods.findOne({
            where: { id: goodid },
            attributes: ['goodname', 'goodprice', 'userid', 'id']
        })
    }
    static async getcarinfo(userid) {  //获取购物车信息
        return await carlist.findAll({
            include: {
                model: goods,
                attributes: ['goodname', 'goodprice', 'id','userid']
            },
            where: {
                userid: userid,
                goodnum: { [Op.ne]: 0 }
            },
            attributes: ['goodnum', 'selected']
        })
    }
    static async selected(userid, goodid) { //购物车勾选
        return await carlist.update({ selected: 1 }, {
            where: {
                userid: userid,
                goodid: goodid
            }
        })

    }
    static async unselected(userid, goodid) {
        return await carlist.update({ selected: 0 }, {
            where: {
                userid: userid,
                goodid: goodid
            }
        })
    }
    static async allunselected(userid) {
        return await carlist.update({ selected: 0 }, {
            where: {
                userid: userid,
            }
        })

    }
    static async getorder(userid) { //确认订单页面获取用户下单信息
        return await carlist.findAll({
            include: {
                model: goods,
                attributes: ['goodname', 'goodprice', 'id',]
            },
            where: {
                userid: userid,
                selected: 1
            }
        })
    }
    static async getAdress(userid) {
        return await address.findAll({
            where: {
                userid: userid
            }
        })
    }
    static async delcart() {
        return await carlist.update({
            goodnum:0
        },{
            where: {
                selected: 1
            }
        })
    }
    static async createbill(orderid, goodid, userid, foodname, ordernum, address, storeid, total, conphone) {
        return await orderlist.create({
            orderid: orderid,
            goodid: goodid,
            userid: userid,
            foodname: foodname,
            ordernum: ordernum,
            address: address,
            storeid: storeid,
            total: total,
            conphone: conphone,
            payed: 0,
            taken: 0
        }).then(res=>{
            goods.decrement(
                {goodnum:ordernum}
            ,{
                where:{
                    id:goodid
                }
            })
        }
        )
    }
    static async paybill(orderid, userid) {
        return await orderlist.update({ payed: 1 }, {
            where: {
                orderid: orderid,
                userid: userid,
            }
        })

    }
    static async getpayed(userid) {
        return await orderlist.findAll({
            where: {
                payed: 1,
                userid: userid
            },
            attributes:['total', [Sequelize.fn('SUM', Sequelize.col('total')), 'total'],
            'ordernum','foodname','storeid','userid','conphone','goodid','orderid'],
            raw:true,
            group: 'orderid',
            order:[['orderid','DESC']]
        })
    }
    static async getpaying(userid) {
        return await orderlist.findAll({
            where: {
                userid: userid,
                payed: 0,
            },
            attributes:['total', [Sequelize.fn('SUM', Sequelize.col('total')), 'total'],
            'ordernum','foodname','storeid','userid','conphone','goodid','orderid'],
            raw:true,
            group: 'orderid',
            order:[['orderid','DESC']]
        })
    }
    static async cancelorder(orderid, userid,ordernum,goodid) { //取消订单
        return orderlist.update({
            payed: -1
        }, {
            where: {
                orderid: orderid,
                userid: userid
            }
        }).then(res=>{
            goods.increment(
                {goodnum:ordernum}
            ,{
                where:{
                    id:goodid
                }
            })
        })
    }
    static async getsellerinfo(storeid){//商家页面信息
        return seller.findOne({
            where:{
                userid:storeid
            }
        })
    }
    static async getallgoods(userid){ //商家页面获取该商家全部商品 
        return goods.findAll({
            where:{
                userid:userid
            }
        })
    }
    static async searchbook(bookname){ //搜索食谱
        return cookbooks.findAll({
            where:{
                [Op.or]:[
                    {
                        context:{
                            [Op.like]:'%'+bookname+'%'
                        },
                    },{
                        making:{
                            [Op.like]:'%'+bookname+'%'
                        },
                    },{
                        title:{
                            [Op.like]:'%'+bookname+'%'
                        },
                    }
                ]
            }
        })
    }
    static async searchgood(goodname){ //搜索商品
        return goods.findAll({
            where:{
                goodname:{
                    [Op.like]:'%'+goodname+'%'
                },
            }
        })
    }
    static async getCancelorders(userid) {
        return await orderlist.findAll({
            where:{
                userid:userid,
                payed:-1
            }
        })
    }
    static async orderdetail(orderid){
        return await orderlist.findAll({
            where:{orderid:orderid}
        })
    }


    ////////////////////////管理员
    static async saddUser(username, userid, password, solt) {  //管理员添加商家用户
        return await user.create({
            username: username,
            userid: userid,
            password: password,
            solt: solt,
            roleid: 2,
        })
    }
    static async getUserAdminInfo(userid) {  //验证管理员身份
        return await user.findOne({
            where: {
                userid,
                roleid: 0
            }
        })
    }
    static async getAllUser() {   //获取全部普通用户信息
        return await user.findAll({
            where: {
                roleid: 1
            },
        })
    }
    static async getAllUsers() { //获取全部商家信息
        return await user.findAll({
            where: {
                roleid: 2
            }
        })
    }
    static async delUser(userid) {  //删除用户
        return await user.destroy({
            where: {
                userid
            }
        })
    }
    static async setAdmin(userid) {  //设置管理员
        return await user.update(
            {
                roleid: 0,
            },
            {
                where: {
                    userid
                }
            }
        )
    }
    static async uploadbook(title, context, making, userid) {  //管理员上传食谱
        return await cookbooks.create({
            context: context,
            userid: userid,
            title: title,
            making: making
        })
    }
    static async getAllorders() {
        return await orderlist.findAll({
        })
    }
    static async getAllbooks() {
        return await cookbooks.findAll({})
    }
    static async delBooks(id) {  //管理员删除食谱
        return await cookbooks.destroy({
            where: {
                id: id/* ctx.params.userid*/
            }
        })
    }


    ///////////////////////////////商家
    static async getSellerInfo(userid) {  //获取商家信息
        return await user.findOne({
            where: {
                userid,
                roleid: 2,
            }
        })
    }
    static async addSeller(storename, storephone, storeadd, userid) {  //商家注册
        return await seller.create({
            storename: storename,
            storephone: storephone,
            storeadd: storeadd,
            userid: userid,
        })
    }
    static async findgoods(goodname, goodnum, userid, goodprice) { //检查是否已存在该商品
        return await goods.findOrCreate({
            where: { 
                goodname: goodname,
                goodnum: goodnum,
                userid: userid,
                goodprice: goodprice
            },
            default: {
                goodname: goodname,
                goodnum: goodnum,
                userid: userid,
                goodprice: goodprice
            }
        })
    }
    static async uploadgoods(goodname, goodnum, userid, goodprice) { //已存在商品更新
        return await goods.update({
            goodname: goodname,
            goodnum: goodnum,
            userid: userid,
            goodprice: goodprice
        }, {
            where: { goodname: goodname, userid: userid }
        })
    }
    static async gettaken(storeid) {
        return await orderlist.findAll({
            where: {
                taken: 1,
                storeid: storeid
            },
            attributes:['total', [Sequelize.fn('SUM', Sequelize.col('total')), 'total'],
            'ordernum','foodname','storeid','userid','conphone','goodid','orderid'],
            raw:true,
            group: 'orderid',
            order:[['userid','DESC']]
        })
    }
    static async gettaking(storeid) {
        return await orderlist.findAll({
            where: {
                storeid: storeid,
                taken: 0,
            },
            attributes:['total', [Sequelize.fn('SUM', Sequelize.col('total')), 'total'],
            'ordernum','foodname','storeid','userid','conphone','goodid','orderid'],
            raw:true,
            group: 'orderid',
            order:[['userid','DESC']]
        })
    }
    static async takeOrder(orderid, userid) {
        return orderlist.update({
            taken: 1
        }, {
            where: {
                orderid: orderid,
                userid: userid
            }
        })
    }
    static async gettakenorder(userid) {
        return orderlist.findAll({
            where: {
                userid: userid,
                taken: 1
            }
        })
    }
    static async getCancel(storeid) {
        return await orderlist.findAll({
            where:{
                storeid:storeid,
                payed:-1
            }
        })
    }
    

    //////////////////////////////////////////////////////////////
    static async findUser(info,roleid){  //关键字搜索用户
        return await user.findAll({
            where:{
                roleid:roleid,
                [Op.or]:[{
                    userid:{
                        [Op.like]:'%'+info+'%'
                    }
                },{
                    username:{
                        [Op.like]:'%'+info+'%'
                    }
                },{
                    id:{
                        [Op.like]:'%'+info+'%'
                    }
                }]
            }
        })
    }
}
module.exports = userDao


