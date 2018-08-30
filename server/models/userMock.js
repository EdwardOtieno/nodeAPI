const SequelizeMock = require('sequelize-mock');

const dbMock = new SequelizeMock();

module.exports = (DataTypes) => {
    var UserMock = dbMock.define('user', {
    id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        instanceMethods: {
            myTestFunc: function () {
                console.log('mocking')
                return 'Test User';
             },
            },
    });
    return UserMock
}