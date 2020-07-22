module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'bookgoods',
        {
            userid:{
                type:DataTypes.STRING,
                field:'userid'
            },
            goodid:{
                type:DataTypes.INTEGER,
                field:'goodid'
            },
            cbtitle:{
                type:DataTypes.STRING,
                field:'cbtitle'
            },
            goodname:{
                type:DataTypes.STRING,
                field:'goodname'
            }
        }
    )
}