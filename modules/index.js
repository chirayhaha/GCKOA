//建立统一管理文件
const config = require('../config/mysql_sequelize');

const Sequelize = config.sequelize

//导入模型统一管理
const user = Sequelize.import(__dirname+'/user.js')
const cookbooks = Sequelize.import(__dirname+'/cookbooks.js')
const orderlist = Sequelize.import(__dirname+'/orderlist.js')
const role = Sequelize.import(__dirname+'/role.js')
const seller = Sequelize.import(__dirname+'/seller.js')
const goods = Sequelize.import(__dirname+'/goods.js')
const address = Sequelize.import(__dirname+'/address.js')
const carlist = Sequelize.import(__dirname+'/carlist.js')
const bookgoods = Sequelize.import(__dirname+'/bookgoods.js')

cookbooks.belongsTo(user,{
    foreignKey:'userid',
    targetKey:'userid'
})

orderlist.belongsTo(user,{
    foreignKey:'address',
    targetKey:'address'
})

orderlist.belongsTo(goods,{
    foreignKey:'foodname',
    targetKey:'goodname'
})

orderlist.belongsTo(seller,{
    foreignKey:'storeid',
    targetKey:'userid',
    
})

user.belongsTo(role,{
    foreignKey:'roleid',
    targetKey:'roleid'
})

address.belongsTo(user,{
    foreignKey:'userid',
    targetKey:'userid'
})

carlist.belongsTo(user,{
    foreignKey:"userid",
    targetKey:'userid'
})

carlist.belongsTo(goods,{
    foreignKey:'goodid',
    targetKey:'id'
})

bookgoods.belongsTo(goods,{
    foreignKey:'goodid',
    targetKey:'id'
})

bookgoods.belongsTo(user,{
    foreignKey:'userid',
    targetKey:'userid'
})
user.hasOne(bookgoods,{
    foreignKey:'userid',
    targetKey:'userid'
})

module.exports = {user,cookbooks,orderlist,role,seller,goods,address,carlist,bookgoods}