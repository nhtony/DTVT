
import AccountsController from './accountsController';

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
        handler: AccountsController.activeAccount(true)
    },
    disableAccount: {
        path: "/accounts/disable",
        method: "put",
        handler: AccountsController.activeAccount(false)
    }
};

const accountAPIs = Object.values(accountRoutes);

export default accountAPIs;