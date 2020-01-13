import AccountsController from './accountsController';
import { authenticate, authorize } from '../../middleware/auth';

const accountRoutes = {
    getAccounts: {
        path: "/accounts",
        method: "get",
        handler: AccountsController.getAccounts
    },
    getAccount: {
        path: "/accounts/:id",
        method: "get",
        handler: AccountsController.getAccountByID
    },
    createLectureAccount: {
        path: "/accounts/lecture",
        method: "post",
        handler: AccountsController.createAccount(true)
    },
    createStudentAccount: {
        path: "/accounts/student",
        method: "post",
        handler: AccountsController.createAccount(false)
    },
    enableAccount: {
        path: "/accounts/enable",
        method: "put",
        handler: [authenticate, authorize('admin'),AccountsController.activeAccount(true)]
    },
    disableAccount: {
        path: "/accounts/disable",
        method: "put",
        handler: [authenticate, authorize('admin'),AccountsController.activeAccount(false)]
    },
    lectureLogin: {
        path: "/accounts/lecture/login",
        method: "post",
        handler: AccountsController.login(true)
    },
    studentLogin: {
        path: "/accounts/student/login",
        method: "post",
        handler: AccountsController.login(false)
    }
};

const accountAPIs = Object.values(accountRoutes);

export default accountAPIs;