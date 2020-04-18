import AccountsController from '../accounts/accountsController';
import { Injector } from '../../DI/Injector';

const accountController = Injector.resolve<AccountsController>(AccountsController);

const authenRoutes = {
    login: {
        path: "/accounts/login",
        method: "post",
        handler: accountController.login
    },
};

const authenAPIs = Object.values(authenRoutes);

export default authenAPIs;