const models = require('../models');

class Service {
    async getControllerById(id) {
        return models.Controller.findOne({
            where: { id },
        });
    }

    async getDevicesById(id) {
        const controller = this.getControllerById(id);
        return controller.getDevices();
    }
}

module.exports = new Service();