import { authenticate, authorize } from '../../middleware/auth';
import StudentController from './studentsController';

const studentRoutes = {
    getStudents: {
        path: "/students",
        method: "get",
        handler: StudentController.getStudents
    },
    getStudent: {
        path: "/students/:id",
        method: "get",
        handler: StudentController.getStudentById
    },
    createStudent: {
        path: "/students",
        method: "post",
        handler: [authenticate, authorize(['admin']), StudentController.createStudent]
    },
    updateStudent: {
        path: "/students",
        method: "put",
        handler: [authenticate, authorize(['admin']), StudentController.updateStudent]
    },
    deleteStudent: {
        path: "/students",
        method: "delete",
        handler: [authenticate, authorize(['admin']), StudentController.deleteStudent]
    }
};

const studentAPIs = Object.values(studentRoutes);

export default studentAPIs;