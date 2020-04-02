import MustSubjectController from './mustSubjectController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const mustSubjectController = Injector.resolve<MustSubjectController>(MustSubjectController);

const mustSubjectRoutes = {
    getMustSubjects: {
        path: "/must-subjects",
        method: "get",
        handler: mustSubjectController.getMustSubjects
    },
    getMustSubjectById: {
        path: "/must-subjects/:id",
        method: "get",
        handler: mustSubjectController.getMustSubjectById
    },
    createMustSubject: {
        path: "/must-subjects",
        method: "post",
        handler: mustSubjectController.createMustSubject
    },
    updateMustSubject: {
        path: "/must-subjects",
        method: "put",
        handler: mustSubjectController.updateMustSubject
    },
    deleteMustSubject: {
        path: "/must-subjects",
        method: "delete",
        handler: mustSubjectController.deleteMustSubject
    }
};

const mustSubjectAPIs = Object.values(mustSubjectRoutes);
export default mustSubjectAPIs;