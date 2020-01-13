
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
        handler: StudentController.createStudent
    },
    updateStudent: {
        path: "/students",
        method: "put",
        handler: StudentController.updateStudent
    },
    deleteStudent: {
        path: "/students",
        method: "delete",
        handler: StudentController.deleteStudent
    }
};

const studentAPIs = Object.values(studentRoutes);

export default studentAPIs;