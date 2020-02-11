import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import lanesSchema from './lanes';
import LanesService from './lanesService';
import { check } from '../../common/error';

@Controller()
class LanesController {

    /**
     * lane_id => card(lane_id)
     * lane = [
     * {
     * id: 
     * title:
     * cards: []
     * }]
     * 
     */

    constructor(protected lanesService: LanesService) { }

    getLanes = async (req: Request, res: Response) => {
        try {
            const resultCards = await this.lanesService.join();
            const cardLanes = resultCards.recordset;

            // Phân loại card theo id (thuộc vào id của lane nào one - many)
            const splitCard: { [index: string]: any } = {};
        
            cardLanes.forEach((item: any) => {
                const card = {
                    id: item.id ? item.id.toString() : null,
                    title: item.title,
                    label: item.label,
                    description: item.description
                }
                splitCard[item.laneId] ? splitCard[item.laneId].push(card) : splitCard[item.laneId] = card.id ? [card] : [];
            });

            const resultLane = await this.lanesService.findAll();
            const lanes = resultLane.recordset;

            // Thêm thuộc tính cards cho lane với giá trị là các mảng thuộc laneId đó
            const resultLanes = lanes.map((lane: any) => {
                if (splitCard.hasOwnProperty(lane.id)) {
                    lane.id = lane.id.toString();
                    return { ...lane, cards: splitCard[lane.id] };
                };
            });

            res.status(200).send(resultLanes);
        } catch (error) {
            console.log("TCL: LanesController -> getLanes -> error", error)
            res.status(500).send();
        }
    }

    getLaneByID = async (req: Request, res: Response) => {
        try {
            const cardId = req.params.id;
            const data = await this.lanesService.findById(Number(cardId));
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: LanesController -> getLaneByID -> error", error)
            res.status(500).send();
        }
    }

    createLane = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = lanesSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { title } = req.body;

            const newLane = await this.lanesService.create(title);

            if (check(newLane, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            const newLaneResult = {
                id: newLane.recordset[0].id.toString(),
                title: newLane.recordset[0].title,
                cards: []
            };
            res.status(200).send({ message: 'Successful!', new: newLaneResult });

        } catch (error) {
            console.log("TCL: LanesController -> createLane -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    updateLane = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = lanesSchema.validate(req.body, { abortEarly: false });
            
            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { id, title } = req.body;

            const updatedLane = await this.lanesService.update(id, title);

            if (check(updatedLane, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            const updateLaneResult = {
                id: updatedLane.recordset[0].id.toString(),
                title: updatedLane.recordset[0].title,
                cards: []
            };

            res.status(200).send({ message: 'Successful!', update: updateLaneResult });

        } catch (error) {
            console.log("TCL: LanesController -> updateLane -> error", error)
            res.status(500).send();
        }
    }

    deleteLane = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedLane = await this.lanesService.delete(id);
            if (check(deletedLane, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Success!', delete: id });
        } catch (error) {
            console.log("TCL: LanesController -> deleteLane -> error", error)
            res.status(500).send();
        }
    }

}

export default LanesController;