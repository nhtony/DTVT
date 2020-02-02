import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import subjectSchema from './subject';
import SubjectService from './subjectsService';
import { check } from '../../common/error';
@Controller()
class SubjectsController {
    
    constructor(protected subjectService:SubjectService) {}

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
            const data = await this.subjectService.findById(id);
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: LecturesController -> getLeclureByID -> error", error)
            res.status(500).send();
        }
    }

    createSubject = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = subjectSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { subjectId, subjectName, subjectNumber, subjectRequired, majorId } = req.body;

            //Check lecutre đã tồn tại chưa
            const existedSubject = await this.subjectService.findById(subjectId);
            if (check(existedSubject,'EXISTED')) return res.status(400).send({ message: "Subject existed!" });

            const newSubject = await this.subjectService.create(subjectId, subjectName, subjectNumber, subjectRequired, majorId);

            if (check(newSubject,'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!' });

        } catch (error) {
            console.log("TCL: SubjectsController -> createLecture -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    updateSubject = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = subjectSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { subjectId, subjectName, subjectNumber, subjectRequired, majorId } = req.body;


            //Check lecutre đã tồn tại chưa
            const existedSubject = await this.subjectService.findById(subjectId);
            if (check(existedSubject,'EXISTED')) return res.status(400).send({ message: "Subject existed!" });

            const updatedLecture = await this.subjectService.update(subjectId, subjectName, subjectNumber, subjectRequired, majorId);

            if (check(updatedLecture,'NOT_CHANGE')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!' });

        } catch (error) {
            console.log("TCL: SubjectsController -> updateLecture -> error", error)
            res.status(500).send();
        }
    }

    deleteSubject = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedSubject = await this.subjectService.delete(id);

            if (check(deletedSubject,'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Success!' });

        } catch (error) {
            console.log("TCL: SubjectsController -> deleteLecture -> error", error)
            res.status(500).send();
        }
    }

}

export default SubjectsController;