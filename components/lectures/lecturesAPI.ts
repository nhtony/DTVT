
import LectureController from './lecturesController';

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
        handler: LectureController.createLecture
    },
    updateLecture: {
        path: "/lectures",
        method: "put",
        handler: LectureController.updateLecture
    },
    deleteLecture: {
        path: "/lectures",
        method: "delete",
        handler: LectureController.deleteLecture
    }
};

const lectureAPIs = Object.values(lectureRoutes);

export default lectureAPIs;