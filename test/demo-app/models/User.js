
      module.exports = (sequelize, DataTypes) => {
        return sequelize.define('User', {
          email: { type: DataTypes.STRING, allowNull: false }
        }, { tableName: 'users' });
      };
    