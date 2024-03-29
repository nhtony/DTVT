import SelectedSubjectController from './selectedSubjectController';
import { Injector } from '../../DI/Injector';
import { authenticate, authorize } from '../../middleware/auth';

const selectedSubjectController = Injector.resolve<SelectedSubjectController>(SelectedSubjectController);

const selectedSubjectRoutes = {
    getDataChart: {
        path: "/selected-subject/data-chart",
        method: "get",
        handler: [authenticate, authorize(["admin"]), selectedSubjectController.getDataChart]
    },
    fetch: {
        path: "/selected-subject/:studentId",
        method: "get",
        handler: [authenticate, authorize(["admin","student"]), selectedSubjectController.getSubjects]
    },
    create: {
        path: "/selected-subject",
        method: "post",
        handler: [authenticate, authorize(["student"]),selectedSubjectController.createSubject]
    },
    delete: {
        path: "/selected-subject",
        method: "delete",
        handler: [authenticate, authorize(["student"]), selectedSubjectController.deleteSubject]
    }
};

const selectedSubjectAPIs = Object.values(selectedSubjectRoutes);

export default selectedSubjectAPIs;