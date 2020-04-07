import SubjectController from './subjectsController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const subjectController = Injector.resolve<SubjectController>(SubjectController);

const subjectRoutes = {
    getSubjects: {
        path: "/subjects",
        method: "get",
        handler: subjectController.getSubjects
    },
    getSubject: {
        path: "/subjects/:id",
        method: "get",
        handler: subjectController.getSubjectID
    },
    createSubject: {
        path: "/subjects",
        method: "post",
        handler: [authenticate, authorize(["admin"]),subjectController.createSubject]
    },
    updateSubject: {
        path: "/subjects",
        method: "put",
        handler: [authenticate, authorize(["admin"]),subjectController.updateSubject]
    },
    updateSubjectStatus: {
        path: "/subjects/status/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),subjectController.updateSubjectStatus]
    },
    deleteSubject: {
        path: "/subjects",
        method: "delete",
        handler: [authenticate, authorize(["admin"]),subjectController.deleteSubject]
    }
};

const subjectAPIs = Object.values(subjectRoutes);

export default subjectAPIs;