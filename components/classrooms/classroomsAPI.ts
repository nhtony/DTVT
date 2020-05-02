import ClassroomController from './classroomsController';
import { authenticate } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const classroomsController = Injector.resolve<ClassroomController>(ClassroomController);

const classroomRoutes = {
    getLectureClassrooms: {
        path: "/classrooms/lecture",
        method: "get",
        handler: [authenticate, classroomsController.getLectureClassrooms]
    },
    getStudentClassrooms: {
        path: "/classrooms/student",
        method: "get",
        handler: [authenticate, classroomsController.getStudentClassrooms]
    },
    getStudentList: {
        path: "/classrooms/students",
        method: "get",
        handler: [authenticate, classroomsController.getStudentList]
    }
}

const classroomAPIs = Object.values(classroomRoutes);

export default classroomAPIs;