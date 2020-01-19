import SubjectController from './subjectsController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const subjectController = Injector.resolve<SubjectController>(SubjectController);

const subjectRoutes = {
    getLecutures: {
        path: "/subjects",
        method: "get",
        handler: subjectController.getSubjects
    },
    getLecture: {
        path: "/subjects/:id",
        method: "get",
        handler: subjectController.getSubjectID
    },
    createLecture: {
        path: "/subjects",
        method: "post",
        handler: [authenticate, authorize(["admin"]),subjectController.createSubject]
    },
    updateLecture: {
        path: "/subjects",
        method: "put",
        handler: [authenticate, authorize(["admin"]),subjectController.updateSubject]
    },
    deleteLecture: {
        path: "/subjects",
        method: "delete",
        handler: [authenticate, authorize(["admin"]),subjectController.deleteSubject]
    }
};

const subjectAPIs = Object.values(subjectRoutes);

export default subjectAPIs;