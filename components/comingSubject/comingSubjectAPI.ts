import ComingSubjectController from './comingSubjectController';
import { Injector } from '../../DI/Injector';
import { authenticate, authorize } from '../../middleware/auth';

const comingSubjectController = Injector.resolve<ComingSubjectController>(ComingSubjectController);

const comingSubjectRoutes = {
    fetch: {
        path: "/coming-subject",
        method: "get",
        handler: [authenticate, authorize(["student","admin"]), comingSubjectController.getSubjects]
    },
    fetchForAdmin: {
        path: "/coming-subject/admin",
        method: "get",
        handler: [authenticate, authorize(["admin"]), comingSubjectController.getSubjectsForAdmin]
    },
    findById: {
        path: "/coming-subject/:id",
        method: "get",
        handler: [authenticate, authorize(["admin"]), comingSubjectController.getSubjectsById]
    },
    create: {
        path: "/coming-subject",
        method: "post",
        handler: [authenticate, authorize(["admin"]), comingSubjectController.createComingSubject]
    },
    update: {
        path: "/coming-subject/:id",
        method: "put",
        handler: [
            authenticate,
            authorize(["admin"]),
            comingSubjectController.updateSubject
        ]
    },
    delete: {
        path: "/coming-subject",
        method: "delete",
        handler: [authenticate, authorize(["admin"]), comingSubjectController.deleteSubject]
    }
};

const comingSubjectAPIs = Object.values(comingSubjectRoutes);
export default comingSubjectAPIs;