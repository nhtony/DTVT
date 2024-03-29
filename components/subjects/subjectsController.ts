import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import SubjectService from './subjectsService';
import MustSubjectService from '../mustSubject/mustSubjectService';
import { check } from '../../common/error';

@Controller()
class SubjectsController {

    constructor(
        protected subjectService: SubjectService,
        protected mustSubService: MustSubjectService) { }

    getSubjects = async (req: Request, res: Response) => {
        try {
            const data = await this.subjectService.findAll();
            res.status(200).send(data.recordset);
        } catch (error) {
            res.status(500).send();
        }
    }

    getSubjectID = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = await this.subjectService.findBy({ MA_MON_HOC: id });
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: LecturesController -> getLeclureByID -> error", error)
            res.status(500).send();
        }
    }

    createSubject = async (req: Request, res: Response) => {
        try {
            let { id, name, number } = req;
            //Check lecutre đã tồn tại chưa
            const existedSubject = await this.subjectService.findBy({ MA_MON_HOC: id });

            if (check(existedSubject, 'EXISTED')) return res.status(400).send({ message: "Subject existed!" });

            const subjectObject = {
                MA_MON_HOC: id,
                TEN_MON_HOC: name,
                SO_TIN_CHI: number
            };

            const newSubject = await this.subjectService.createSubject(subjectObject);

            if (check(newSubject, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail in subject!' });
            res.status(200).send({ message: 'Môn học vừa được tạo', id });

        } catch (error) {
            console.log("SubjectsController -> createSubject -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    updateSubject = async (req: Request, res: Response) => {
        try {
            let { id, name, number } = req;
            const existedSubject = await this.subjectService.findBy({ MA_MON_HOC: id });
            if (!check(existedSubject, 'EXISTED')) return res.status(400).send({ message: "Subject is not existed!" });
            const updatedObj = {
                TEN_MON_HOC: name,
                SO_TIN_CHI: number
            };
            const updatedSubject = await this.subjectService.updateSubject(updatedObj, { MA_MON_HOC: id });
            if (check(updatedSubject, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Môn học vừa chỉnh sửa', id });
        } catch (error) {
            console.log("SubjectsController -> updateSubject -> error", error);
            res.status(500).send();
        }
    }

    updateSubjectStatus = async (req: Request, res: Response) => {
        try {
            let { id, status } = req.body;
            const existedSub = await this.subjectService.findBy({ MA_MON_HOC: id });

            if (!check(existedSub, 'EXISTED')) return res.status(400).send({ message: 'Subject is not exist !' });

            if (!status) return res.status(400).send({ message: 'Status is required!' });

            if (status < 0 || status > 3) {
                return res.status(400).send({ message: 'Status is invalid!' });
            };

            const updatedSub = await this.subjectService.updateSubject({ TRANG_THAI: status }, { MA_MON_HOC: id });

            if (check(updatedSub, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!', id });

        } catch (error) {
            console.log("TCL: AccountsController -> activeAccount -> error", error)
            res.status(500).send(error);
        }
    };

    deleteSubject = async (req: Request, res: Response) => {
        try {
            const { id } = req;
            const deletedSubject = await this.subjectService.delete(id);
            if (check(deletedSubject, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Success!' });
        } catch (error) {
            console.log("TCL: SubjectsController -> deleteLecture -> error", error)
            res.status(500).send();
        }
    }
}

export default SubjectsController;