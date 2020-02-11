import CardsController from './cardsController';
import { authenticate, authorize } from '../../middleware/auth';
import { Injector } from '../../DI/Injector';

const cardsController = Injector.resolve<CardsController>(CardsController);

const cardsRoutes = {
    getCards: {
        path: "/cards",
        method: "get",
        handler: cardsController.getCards
    },
    createCard: {
        path: "/cards",
        method: "post",
        handler: [cardsController.createCard]
    },
    updateCard: {
        path: "/cards",
        method: "put",
        handler: [cardsController.updateCard]
    },
    deleteCard: {
        path: "/cards",
        method: "delete",
        handler: [cardsController.deleteCard]
    }
};

const cardsAPIs = Object.values(cardsRoutes);

export default cardsAPIs;