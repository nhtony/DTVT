import TelecomunicationController from './telecomunicationController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const telecomunicationController = Injector.resolve<TelecomunicationController>(TelecomunicationController);

const telecomunicationRoutes = {
    getSubjects: {
        path: "/telecomunication/subjects",
        method: "get",
        handler: [authenticate, authorize(["admin"]),telecomunicationController.getSubjects]
    },
    getSubjectsBySemester: {
        path: "/telecomunication/subjects/semester/:semester",
        method: "get",
        handler: [authenticate, authorize(["student"]),telecomunicationController.getSubjectsBySemester]
    },
    getTreeSubjects: {
        path: "/telecomunication/subjects/tree",
        method: "get",
        handler: [authenticate, authorize(["student"]),telecomunicationController.getTreeSubjects]
    },
    updateSubjectType: {
        path: "/telecomunication/subjects/type/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),telecomunicationController.updateSubjectType]
    },
    updateSemester: {
        path: "/telecomunication/semester/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),telecomunicationController.updateSemester]
    },

};

const telecomunicationAPIs = Object.values(telecomunicationRoutes);

export default telecomunicationAPIs;