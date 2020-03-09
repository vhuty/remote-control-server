const models = require('../models');

class Service {
    async getDeviceById(id) {
        return models.Device.findOne({
            where: { id },
        });
    }

    async getControllersById(id) {
        const device = this.getDeviceById(id);
        return device.getControllers();
    }
}

module.exports = new Service();