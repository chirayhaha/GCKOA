module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'seller',
        {
            storename:{
                type:DataTypes.STRING,
                field:'storename'
            },
            storephone:{
                type:DataTypes.STRING,
                field:'storephone'
            },
            storeadd:{
                type:DataTypes.STRING,
                field:'storeadd'
            },
            userid:{
                type: DataTypes.STRING,
                field: 'userid',
            },
        }
    );
    
}