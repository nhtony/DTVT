import ElectricityController from './electricityController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const electricityController = Injector.resolve<ElectricityController>(ElectricityController);

const electronicRoutes = {
    getSubjects: {
        path: "/electricity/subjects",
        method: "get",
        handler: [authenticate, authorize(["admin"]),electricityController.getSubjects]
    },
    getSubjectsDDT: {
        path: "/electricity/subjects/ddt",
        method: "get",
        handler:[authenticate, authorize(["admin"]),electricityController.getSubjectsByMajor('0')] 
    },
    getSubjectsDTVT: {
        path: "/electricity/subjects/dtvt",
        method: "get",
        handler:[authenticate, authorize(["admin"]),electricityController.getSubjectsByMajor('0')] 
    },
    getSubjectsBySemesterDDT: {
        path: "/electricity/subjects/semester/ddt/:semester",
        method: "get",
        handler: [authenticate, authorize(["student"]),electricityController.getSubjectsBySemester('0')]
    },
    getSubjectsBySemesterDTVT: {
        path: "/electricity/subjects/semester/dtvt/:semester",
        method: "get",
        handler:[ authenticate, authorize(["student"]),electricityController.getSubjectsBySemester('1')]
    },
    getTreeSubjectsDDT: {
        path: "/electricity/subjects/tree/ddt",
        method: "get",
        handler: [authenticate, authorize(["student"]),electricityController.getTreeSubjects('0')]
    },
    getTreeSubjectsDTVT: {
        path: "/electricity/subjects/tree/dtvt",
        method: "get",
        handler: [authenticate, authorize(["student"]),electricityController.getTreeSubjects('1')]
    },
    updateSubjectType: {
        path: "/electricity/subjects/type/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),electricityController.updateSubjectType]
    },
    updateSemester: {
        path: "/electricity/semester/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),electricityController.updateSemester]
    },

};

const electricityAPIs = Object.values(electronicRoutes);

export default electricityAPIs;