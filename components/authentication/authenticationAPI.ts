import AccountsController from './authenticationController';
import { Injector } from '../../DI/Injector';

const authController = Injector.resolve<AccountsController>(AccountsController);

const authenRoutes = {
    login: {
        path: "/auth/login",
        method: "post",
        handler: authController.login
    },
    loginAdmin: {
        path: "/auth/login/admin",
        method: "post",
        handler: authController.loginAdmin
    }
};

const authenAPIs = Object.values(authenRoutes);

export default authenAPIs;