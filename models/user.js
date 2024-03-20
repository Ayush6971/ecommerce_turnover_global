const { DataTypes } = require('sequelize');
const { sequelize } = require('./index')

const user = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isAuthenticated: {
        type: DataTypes.BOOLEAN,
        default: false
    }
}, {
    tableName: 'users'
})


module.exports = user