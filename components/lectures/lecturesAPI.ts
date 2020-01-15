import LectureController from './lecturesController';
import { authenticate, authorize } from '../../middleware/auth';

const lectureRoutes = {
    getLecutures: {
        path: "/lectures",
        method: "get",
        handler: LectureController.getLeclures
    },
    getLecture: {
        path: "/lectures/:id",
        method: "get",
        handler: LectureController.getLeclureByID
    },
    createLecture: {
        path: "/lectures",
        method: "post",
        handler: [authenticate, authorize(["admin"]),LectureController.createLecture]
    },
    updateLecture: {
        path: "/lectures",
        method: "put",
        handler: [authenticate, authorize(["admin"]),LectureController.updateLecture]
    },
    deleteLecture: {
        path: "/lectures",
        method: "delete",
        handler: [authenticate, authorize(["admin"]),LectureController.deleteLecture]
    }
};

const lectureAPIs = Object.values(lectureRoutes);

export default lectureAPIs;