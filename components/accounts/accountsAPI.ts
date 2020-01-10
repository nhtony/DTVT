
import AccountsController from './accountsController';

const accountRoutes = {
    getAccounts: {
        path: "/accounts",
        method: "get",
        handler: AccountsController.getAccounts
    },
    getLectureAccounts: {
        path: "/accounts/lecture",
        method: "get",
        handler: AccountsController.getAccountByID(true)
    },
    getStudentAccounts: {
        path: "/accounts/student",
        method: "get",
        handler: AccountsController.getAccountByID(false)
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
    }
};

const accountAPIs = Object.values(accountRoutes);

export default accountAPIs;