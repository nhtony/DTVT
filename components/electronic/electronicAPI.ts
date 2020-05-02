import ElectronicController from './electronicController';
import SubjectController from '../subjects/subjectsController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const electronicController = Injector.resolve<ElectronicController>(ElectronicController);
const subjectController = Injector.resolve<SubjectController>(SubjectController);

const electronicRoutes = {
    eleGetSubjects: {
        path: "/electronic/subjects",
        method: "get",
        handler: [authenticate, authorize(["admin"]), electronicController.getSubjects]
    },
    eleGetSubjectsBySemesterDDT: {
        path: "/electronic/subjects/semester/ddt/:semester",
        method: "get",
        handler: [authenticate, authorize(["student"]), electronicController.getSubjectsBySemester('0')]
    },
    eleGetSubjectsBySemesterDTVT: {
        path: "/electronic/subjects/semester/dtvt/:semester",
        method: "get",
        handler: [authenticate, authorize(["student"]), electronicController.getSubjectsBySemester('1')]
    },
    eleGetTreeSubjectsDDT: {
        path: "/electronic/subjects/tree/ddt",
        method: "get",
        handler: [authenticate, authorize(["student"]), electronicController.getTreeSubjects('0')]
    },
    eleGetTreeSubjectsDTVT: {
        path: "/electronic/subjects/tree/dtvt",
        method: "get",
        handler: [authenticate, authorize(["student"]), electronicController.getTreeSubjects('1')]
    },
    eleCreatedSubject: {
        path: "/electronic/subjects",
        method: "post",
        handler: [
            authenticate,
            authorize(["admin"]),
            electronicController.createdElectronic,
            subjectController.createSubject
        ]
    },
    eleUpdateSubject: {
        path: "/electronic/subjects",
        method: "put",
        handler: [
            authenticate,
            authorize(["admin"]),
            electronicController.updateSubject,
            subjectController.updateSubject
        ]
    },
    eleUpdateSubjectType: {
        path: "/electronic/subjects/type/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]), electronicController.updateSubjectType]
    },
    eleUpdateSemester: {
        path: "/electronic/semester/update",
        method: "put",
        handler: [authenticate, authorize(["admin"]), electronicController.updateSemester]
    },
    eleDeleteSubject: {
        path: "/electronic/subjects",
        method: "delete",
        handler: [authenticate, authorize(["admin"]), electronicController.deleteSubject]
    }
};

const electronicAPIs = Object.values(electronicRoutes);

export default electronicAPIs;