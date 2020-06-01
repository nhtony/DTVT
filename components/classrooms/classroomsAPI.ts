import ClassroomController from './classroomsController';
import { authenticate } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const classroomsController = Injector.resolve<ClassroomController>(ClassroomController);

const classroomRoutes = {
    getLectureClassrooms: {
        path: "/classrooms/lecture/classrooms",
        method: "get",
        handler: [authenticate, classroomsController.getLectureClassrooms]
    },
    getConsultants: {
        path: "/classrooms/lecture/consultants",
        method: "get",
        handler: [authenticate, classroomsController.getConsultants]
    },
    getGrades: {
        path: "/classrooms/lecture/grades",
        method: "get",
        handler: [authenticate, classroomsController.getGrades]
    },
    getStudentClassrooms: {
        path: "/classrooms/student",
        method: "get",
        handler: [authenticate, classroomsController.getStudentClassrooms]
    },
    getClassroomWillOpen: {
        path: "/classrooms/student/will-open",
        method: "get",
        handler: [authenticate, classroomsController.getClassroomWillOpen]
    },
    getStudentList: {
        path: "/classrooms/students",
        method: "get",
        handler: [authenticate, classroomsController.getStudentList]
    },
    appointLead: {
        path: "/classrooms/lead/appoint",
        method: "put",
        handler: [authenticate, classroomsController.appointLead(1)]
    },
    dismissLead: {
        path: "/classrooms/lead/dismiss",
        method: "put",
        handler: [authenticate, classroomsController.appointLead(0)]
    },
    getInfoClassroom: {
        path: "/classrooms/info",
        method: "get",
        handler: [authenticate, classroomsController.getInfoClassroom, classroomsController.checkLeads]
    },
    getCategory: {
        path: "/classrooms/category",
        method: "get",
        handler: [authenticate, classroomsController.getCategory]
    },
    createClassroom: {
        path: "/classrooms",
        method: "post",
        handler: [authenticate, classroomsController.createClassroom]
    },
    getScores: {
        path: "/scores",
        method: "get",
        handler: [authenticate, classroomsController.getScores]
    },
    inputScore: {
        path: "/scores",
        method: "put",
        handler: [authenticate, classroomsController.getScores]
    }
}

const classroomAPIs = Object.values(classroomRoutes);

export default classroomAPIs;