import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import cardsSchema from './cards';
import CardsService from './cardsService';
import { check } from '../../common/error';

@Controller()
class CardsController {

    constructor(protected cardsService: CardsService) { }

    getCards = async (req: Request, res: Response) => {
        try {
            const data = await this.cardsService.findAll();
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: CardsController -> getCards -> error", error)
            res.status(500).send();
        }
    }

    getCardByID = async (req: Request, res: Response) => {
        try {
            const cardId = req.params.id;
            const data = await this.cardsService.findById(cardId);
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: CardsController -> getCardByID -> error", error)
            res.status(500).send();
        }
    }

    createCard = async (req: Request, res: Response) => {
        try {

            //Validation

            const validResult = cardsSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { cardId, title, label, description, laneId } = req.body;

            const newCard = await this.cardsService.create(cardId, title, label, description, laneId);

            if (check(newCard, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!' });

        } catch (error) {
            console.log("TCL: CardsController -> createCard -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    updateCard = async (req: Request, res: Response) => {
        try {



            let { cardId, laneId } = req.body;

            const updatedCard = await this.cardsService.update(cardId, laneId);

            if (check(updatedCard, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!' });

        } catch (error) {
            console.log("TCL: CardsController -> updateCard -> error", error);
            res.status(500).send();
        }
    }

    deleteCard = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedCard = await this.cardsService.delete(id);
            if (check(deletedCard, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Success!', deleteId: id });
        } catch (error) {
            console.log("TCL: CardsController -> deleteCard -> error", error);
            res.status(500).send();
        }
    }
}

export default CardsController;