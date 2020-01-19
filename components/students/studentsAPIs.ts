import { authenticate, authorize } from '../../middleware/auth';
import StudentController from './studentsController';
import { Injector } from '../../DI/Injector';

const studentController = Injector.resolve<StudentController>(StudentController);

const studentRoutes = {
    getStudents: {
        path: "/students",
        method: "get",
        handler: studentController.getStudents
    },
    getStudent: {
        path: "/students/:id",
        method: "get",
        handler: studentController.getStudentById
    },
    createStudent: {
        path: "/students",
        method: "post",
        handler: [authenticate, authorize(['admin']), studentController.createStudent]
    },
    updateStudent: {
        path: "/students",
        method: "put",
        handler: [authenticate, authorize(['admin']), studentController.updateStudent]
    },
    deleteStudent: {
        path: "/students",
        method: "delete",
        handler: [authenticate, authorize(['admin']), studentController.deleteStudent]
    }
};

const studentAPIs = Object.values(studentRoutes);

export default studentAPIs;