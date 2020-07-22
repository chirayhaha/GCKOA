module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'address',
        {
            province:{
                type:DataTypes.STRING,
                field:'province'
            },
            city:{
                type:DataTypes.STRING,
                field:'city'
            },
            area:{
                type:DataTypes.STRING,
                field:'area'
            },
            add:{
                type:DataTypes.STRING,
                field:'add'
            },
            userid:{
                type:DataTypes.STRING,
                field:'userid'
            },
            conphone:{
                type:DataTypes.STRING,
                field:'conphone'
            }

        }
    );
    
}