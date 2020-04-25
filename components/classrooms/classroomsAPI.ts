import ClassroomController from './classroomsController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const classroomsController = Injector.resolve<ClassroomController>(ClassroomController);

const classroomRoutes = {
    getClassrooms: {
        path: "/classrooms",
        method: "get",
        handler: [authenticate, authorize(["student", "lecture"]), classroomsController.getClassrooms]
    },
    getStudentList: {
        path: "/classrooms/students",
        method: "get",
        handler: [authenticate, authorize(["student", "lecture"]), classroomsController.getStudentList]
    }
}

const classroomAPIs = Object.values(classroomRoutes);

export default classroomAPIs;