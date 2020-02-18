import AccountsController from './accountsController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const accountController = Injector.resolve<AccountsController>(AccountsController);

const accountRoutes = {
    getAccounts: {
        path: "/accounts",
        method: "get",
        handler: accountController.getAccounts
    },
    getAccount: {
        path: "/accounts/:id",
        method: "get",
        handler: accountController.getAccountByID
    },
    enableAccount: {
        path: "/accounts/enable",
        method: "put",
        handler: [authenticate, authorize(["admin"]), accountController.activeAccount(true)]
    },
    disableAccount: {
        path: "/accounts/disable",
        method: "put",
        handler: [authenticate, authorize(["admin"]), accountController.activeAccount(false)]
    },
    createLectureAccount: {
        path: "/accounts/lecture",
        method: "post",
        handler: accountController.createAccount(true)
    },
    lectureLogin: {
        path: "/accounts/lecture/login",
        method: "post",
        handler: accountController.login(true)
    },
    createStudentAccount: {
        path: "/accounts/student",
        method: "post",
        handler: accountController.createAccount(false)
    },
    setStudentRole: {
        path: "/accounts/student/role/set",
        method: "put",
        handler: [authenticate, authorize(['admin', 'lecture']), accountController.setStudentRole]
    },
    studentLogin: {
        path: "/accounts/student/login",
        method: "post",
        handler: accountController.login(false)
    },
    resetPassword: {
        path: "/accounts/password/reset",
        method: "post",
        handler: [authenticate, accountController.resetPassword]
    },
    changePassword: {
        path: "/accounts/password/change",
        method: "post",
        handler: [authenticate, authorize(['admin', 'lecture', 'student']), accountController.changePassword]
    }
};

const accountAPIs = Object.values(accountRoutes);

export default accountAPIs;