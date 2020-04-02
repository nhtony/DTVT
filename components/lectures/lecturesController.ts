import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import lectureSchema from './lecture';
import LectureSevice from './lecturesService';
import { check } from '../../common/error';

@Controller()
class LecturesController {

    constructor(protected lectureService: LectureSevice) { }

    getLectures = async (req: Request, res: Response) => {
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
            const data = await this.lectureService.findBy({MA_GIANG_VIEN: id});
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
            const existedLecture = await this.lectureService.findBy({MA_GIANG_VIEN:id});
            if (check(existedLecture, 'EXISTED')) return res.status(400).send({ message: "Lecture existed!" });

            const objectLecture = {
                MA_GIANG_VIEN: id,
                HO_GIANG_VIEN: firstname,
                TEN_GIANG_VIEN: lastname,
                EMAIL: email,
                SDT: phone,
                DIA_CHI: address,
                MaKhoa: khoaId
            };

            const newLecture = await this.lectureService.createLecture(objectLecture);

            if (check(existedLecture, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!', new: newLecture.recordset[0] });

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
            const existedLecture = await this.lectureService.findBy({MA_GIANG_VIEN:id});
            if (!check(existedLecture, 'EXISTED')) return res.status(400).send({ message: "Lecture not exist!" });

            const objectLecture = {
                HO_GIANG_VIEN: firstname,
                TEN_GIANG_VIEN: lastname,
                EMAIL: email,
                SDT: phone,
                DIA_CHI: address,
                MaKhoa: khoaId
            };

            const updatedLecture = await this.lectureService.updateLecture(objectLecture,{ MA_GIANG_VIEN: id});

            if (check(updatedLecture, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!', update: updatedLecture.recordset[0] });

        } catch (error) {
            console.log("TCL: LecturesController -> updateLecture -> error", error)
            res.status(500).send();
        }
    }

    deleteLecture = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedLecture = await this.lectureService.delete(id);
            if (check(deletedLecture, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Success!', deleteId: id });
        } catch (error) {
            console.log("TCL: LecturesController -> deleteLecture -> error", error);
            res.status(500).send();
        }
    }
}

export default LecturesController;