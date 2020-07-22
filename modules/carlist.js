module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'carlist',
        {
            userid:{
                type: DataTypes.STRING,
                field: 'userid',
            },
            
            goodid:{
                type: DataTypes.INTEGER,
                field:'goodid'
            },
            goodnum:{
                type: DataTypes.INTEGER,
                field:'goodnum'
            },
            selected:{
                type:DataTypes.TINYINT,
                field:"selected"
            }

        }
    )
}