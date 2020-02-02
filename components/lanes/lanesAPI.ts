import LanesController from './lanesController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const lanesController = Injector.resolve<LanesController>(LanesController);

const lanesRoutes = {
    getLanes: {
        path: "/lanes",
        method: "get",
        handler: lanesController.getLanes
    },
    getLane: {
        path: "/lanes/:id",
        method: "get",
        handler: lanesController.getLaneByID
    },
    // getLaneDetail: {
    //     path: "/lanes/detail/:id",
    //     method: "get",
    //     handler: [lanesController.getLaneDetail]
    // },
    createLane: {
        path: "/lanes",
        method: "post",
        handler: [lanesController.createLane]
    },
    updateLane: {
        path: "/lanes",
        method: "put",
        handler: [lanesController.updateLane]
    },
    deleteLane: {
        path: "/lanes",
        method: "delete",
        handler: [lanesController.deleteLane]
    }
};

const lanesAPIs = Object.values(lanesRoutes);

export default lanesAPIs;