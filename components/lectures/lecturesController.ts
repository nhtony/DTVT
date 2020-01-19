import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import lectureSchema from './lecture';
import LectureSevice from './lecturesService';

@Controller()
class LecturesController {

    constructor(protected lectureService: LectureSevice) { }

    getLeclures = async (req: Request, res: Response) => {
        try {
            const data = await this.lectureService.findAll();
            res.status(200).send(data.recordset);
        } catch (error) {
            res.status(500).send();
        }
    }

    getLeclureByID = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = await this.lectureService.findById(id);
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: LecturesController -> getLeclureByID -> error", error)
            res.status(500).send();
        }
    }

    createLecture = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = lectureSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { id, firstname, lastname, email, phone, address, khoaId } = req.body;

            if (khoaId !== 1) khoaId = 1;

            //Check lecutre đã tồn tại chưa
            const existedLecture = await this.lectureService.findById(id);
            if (existedLecture.recordset.length) return res.status(400).send({ message: "Lecture existed!" });

            const newLecture = await this.lectureService.create(id, firstname, lastname, email, phone, address, khoaId);

            if (newLecture.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });

            res.status(200).send({ massage: 'Successful!' });

        } catch (error) {
            console.log("TCL: LecturesController -> getLeclureByID -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    updateLecture = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = lectureSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { id, firstname, lastname, email, phone, address, khoaId } = req.body;

            if (khoaId !== 1) khoaId = 1;

            //Check lecutre đã tồn tại chưa
            const existedLecture = await this.lectureService.findById(id);
            if (!existedLecture.recordset.length) return res.status(400).send({ message: "Lecture not exist!" });

            const updatedLecture = await this.lectureService.update(id, firstname, lastname, email, phone, address, khoaId);

            if (updatedLecture.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });

            res.status(200).send({ massage: 'Successful!' });

        } catch (error) {
            console.log("TCL: LecturesController -> updateLecture -> error", error)
            res.status(500).send();
        }
    }

    deleteLecture = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedLecture = await this.lectureService.delete(id);
            if (!deletedLecture.rowsAffected.length) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Success!' });
        } catch (error) {
            console.log("TCL: LecturesController -> deleteLecture -> error", error);
            res.status(500).send();
        }
    }
}

export default LecturesController;