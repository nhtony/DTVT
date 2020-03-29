import MustSubjectController from './mustSubjectController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const electronicController = Injector.resolve<MustSubjectController>(MustSubjectController);

const electronicRoutes = {
    getMustSubjects: {
        path: "/must-subjects",
        method: "get",
        handler: electronicController.getMustSubjects
    },
    getMustSubjectById: {
        path: "/must-subjects/:id",
        method: "get",
        handler: electronicController.getMustSubjectById
    },
    createMustSubject: {
        path: "/must-subjects",
        method: "post",
        handler: electronicController.createMustSubject
    },
    updateMustSubject: {
        path: "/must-subjects",
        method: "put",
        handler: electronicController.updateMustSubject
    },
    deleteMustSubject: {
        path: "/must-subjects",
        method: "delete",
        handler: electronicController.deleteMustSubject
    }
};

const electronicAPIs = Object.values(electronicRoutes);

export default electronicAPIs;