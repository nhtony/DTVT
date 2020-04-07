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
    login: {
        path: "/accounts/login",
        method: "post",
        handler: accountController.login
    },
    getCredential: {
        path: "/credential",
        method: "get",
        handler: [authenticate, authorize(["lecture", "student"]), accountController.getCredential]
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