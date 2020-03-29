import LectureController from './lecturesController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const lectureController = Injector.resolve<LectureController>(LectureController);

const lectureRoutes = {
    getLectures: {
        path: "/lectures",
        method: "get",
        handler: lectureController.getLectures
    },
    getLecture: {
        path: "/lectures/:id",
        method: "get",
        handler: lectureController.getLeclureByID
    },
    createLecture: {
        path: "/lectures",
        method: "post",
        handler: [authenticate, authorize(["admin"]),lectureController.createLecture]
    },
    updateLecture: {
        path: "/lectures",
        method: "put",
        handler: [authenticate, authorize(["admin"]),lectureController.updateLecture]
    },
    deleteLecture: {
        path: "/lectures",
        method: "delete",
        handler: [authenticate, authorize(["admin"]),lectureController.deleteLecture]
    }
};

const lectureAPIs = Object.values(lectureRoutes);

export default lectureAPIs;