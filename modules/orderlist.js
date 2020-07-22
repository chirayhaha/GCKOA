module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'orderlist',
        {
            foodname:{
                type:DataTypes.STRING,
                field:'foodname'
            },
            address:{
                type:DataTypes.STRING,
                field:'address'
            },
            ordernum:{
                type: DataTypes.INTEGER,
                field: 'ordernum',
            },
            storeid:{
                type: DataTypes.INTEGER,
                field: 'storeid',
            },
            total:{
                type:DataTypes.DECIMAL,
                field:'total'
            },
            payed:{
                type:DataTypes.INTEGER,
                field:'payed'
            },
            userid:{
                type:DataTypes.STRING,
                field:'userid'
            },
            conphone:{
                type:DataTypes.STRING,
                field:'conphone'
            },
            goodid:{
                type:DataTypes.INTEGER,
                field:'goodid'
            },
            orderid:{
                type:DataTypes.BIGINT,
                field:'orderid'
            },
            taken:{
                type:DataTypes.INTEGER,
                field:'taken'
            },
        }
    );
    
}