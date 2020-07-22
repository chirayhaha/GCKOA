module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'cookbooks',
        {
            context:{
                type:DataTypes.STRING,
                field:'context'
            },
            userid:{
                type:DataTypes.STRING,
                field:'userid'
            },
            title:{
                type:DataTypes.STRING,
                field:'title'
            },
            making:{
                type:DataTypes.STRING,
                field:'making'
            }

        }
    );
    
}