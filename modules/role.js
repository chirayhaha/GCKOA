module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'role',
        {
            rolename:{
                type:DataTypes.STRING,
                field:'rolename'
            },
            roleid:{
                type: DataTypes.INTEGER,
                field: 'roleid'
            }
        }
    )
}