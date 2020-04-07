import ElectronicController from './electronicController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const electronicController = Injector.resolve<ElectronicController>(ElectronicController);

const electronicRoutes = {
    getSubjects: {
        path: "/electronic/subjects",
        method: "get",
        handler: [authenticate, authorize(["admin"]),electronicController.getSubjects]
    },
    getSubjectsDDT: {
        path: "/electronic/subjects/ddt",
        method: "get",
        handler:[authenticate, authorize(["admin"]),electronicController.getSubjectsByMajor('0')] 
    },
    getSubjectsDTVT: {
        path: "/electronic/subjects/dtvt",
        method: "get",
        handler:[authenticate, authorize(["admin"]),electronicController.getSubjectsByMajor('0')] 
    },
    getSubjectsBySemesterDDT: {
        path: "/electronic/subjects/semester/ddt/:semester",
        method: "get",
        handler: [authenticate, authorize(["student"]),electronicController.getSubjectsBySemester('0')]
    },
    getSubjectsBySemesterDTVT: {
        path: "/electronic/subjects/semester/dtvt/:semester",
        method: "get",
        handler:[ authenticate, authorize(["student"]),electronicController.getSubjectsBySemester('1')]
    },
    getTreeSubjectsDDT: {
        path: "/electronic/subjects/tree/ddt",
        method: "get",
        handler: [authenticate, authorize(["student"]),electronicController.getTreeSubjects('0')]
    },
    getTreeSubjectsDTVT: {
        path: "/electronic/subjects/tree/dtvt",
        method: "get",
        handler: [authenticate, authorize(["student"]),electronicController.getTreeSubjects('1')]
    },
    updateSubjectType: {
        path: "/electronic/subjects/type/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),electronicController.updateSubjectType]
    },
    updateSemester: {
        path: "/electronic/semester/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),electronicController.updateSemester]
    },

};

const electronicAPIs = Object.values(electronicRoutes);

export default electronicAPIs;