import ElectricityController from './electricityController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const electricityController = Injector.resolve<ElectricityController>(ElectricityController);

const electronicRoutes = {
    elecGetSubjects: {
        path: "/electricity/subjects",
        method: "get",
        handler: [authenticate, authorize(["admin"]),electricityController.getSubjects]
    },
    elecGetSubjectsBySemesterDDT: {
        path: "/electricity/subjects/semester/ddt/:semester",
        method: "get",
        handler: [authenticate, authorize(["student"]),electricityController.getSubjectsBySemester('0')]
    },
    elecGetSubjectsBySemesterDTVT: {
        path: "/electricity/subjects/semester/dtvt/:semester",
        method: "get",
        handler:[ authenticate, authorize(["student"]),electricityController.getSubjectsBySemester('1')]
    },
    elecGetTreeSubjectsDDT: {
        path: "/electricity/subjects/tree/ddt",
        method: "get",
        handler: [authenticate, authorize(["student"]),electricityController.getTreeSubjects('0')]
    },
    elecGetTreeSubjectsDTVT: {
        path: "/electricity/subjects/tree/dtvt",
        method: "get",
        handler: [authenticate, authorize(["student"]),electricityController.getTreeSubjects('1')]
    },
    elecUpdateSubjectType: {
        path: "/electricity/subjects/type/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),electricityController.updateSubjectType]
    },
    elecUpdateSemester: {
        path: "/electricity/subjects/semester/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]),electricityController.updateSemester]
    },
    elecDeleteSubject: {
        path: "/electricity/subjects",
        method: "delete",
        handler: [authenticate, authorize(["admin"]), electricityController.deleteSubject]
    }
};

const electricityAPIs = Object.values(electronicRoutes);

export default electricityAPIs;