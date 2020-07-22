module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'goods',
        {
            userid:{
                type: DataTypes.STRING,
                field: 'userid',
            },
            goodname:{
                type: DataTypes.STRING,
                field:'goodname'
            },
            goodnum:{
                type: DataTypes.INTEGER,
                field:'goodnum'
            },
            goodprice:{
                type: DataTypes.DECIMAL,
                field:'goodprice'
            }

        }
    )
}