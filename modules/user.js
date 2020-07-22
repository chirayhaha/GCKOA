//定义模型
//DataTypes类属性对应数据库中创建字段的数据类型，它是一个静态类可以直接引用其属性或方法
module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'user',
        {
            userid:{
                type: DataTypes.STRING,
                field: 'userid',
            },
            password:{
                type: DataTypes.STRING,
                field: 'password'
            },
            username:{
                type: DataTypes.STRING,
                field: 'username'
            },
            address:{
                type: DataTypes.STRING,
                field:'address'
            },
            roleid:{
                type: DataTypes.INTEGER,
                field:'roleid'
            },
            solt:{
                type: DataTypes.STRING,
                field:'solt'
            }
        },
    );
}

