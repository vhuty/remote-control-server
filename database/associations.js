'use strict';

module.exports = (sequelize) => {
    const { Device, Controller } = sequelize.models;

    // Many-to-many [

    Device.belongsToMany(Controller, { through: 'DeviceController', foreignKey: 'deviceId' });
    Controller.belongsToMany(Device, { through: 'DeviceController', foreignKey: 'controllerId' });
    
    // ]
};
