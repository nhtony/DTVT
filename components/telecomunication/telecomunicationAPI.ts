import TelecomunicationController from './telecomunicationController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const telecomunicationController = Injector.resolve<TelecomunicationController>(TelecomunicationController);

const telecomunicationRoutes = {
    teleGetSubjects: {
        path: "/telecomunication/subjects",
        method: "get",
        handler: [authenticate, authorize(["admin"]),telecomunicationController.getSubjects]
    },
    teleGetSubjectsBySemester: {
        path: "/telecomunication/subjects/semester/:semester",
        method: "get",
        handler: [authenticate, authorize(["student"]),telecomunicationController.getSubjectsBySemester]
    },
    teleGetTreeSubjects: {
        path: "/telecomunication/subjects/tree",
        method: "get",
        handler: [authenticate, authorize(["student"]),telecomunicationController.getTreeSubjects]
    },
    teleUpdateSubjectType: {
        path: "/telecomunication/subjects/type/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),telecomunicationController.updateSubjectType]
    },
    teleUpdateSemester: {
        path: "/telecomunication/semester/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),telecomunicationController.updateSemester]
    },
    teleDeleteSubject: {
        path: "/telecomunication/subjects",
        method: "delete",
        handler: [authenticate, authorize(["admin"]), telecomunicationController.deleteSubject]
    }
};

const telecomunicationAPIs = Object.values(telecomunicationRoutes);

export default telecomunicationAPIs;