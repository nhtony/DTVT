import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import SelectedSubjectSchema from './selectedSubject';
import SelectedSubjectService from './selectedSubjectService';
import { check } from '../../common/error';

@Controller()
class SelectedSubjectController {

    constructor(protected selectedSubjectService: SelectedSubjectService) { }

    getSubjects = async (req: Request, res: Response) => {
        try {
            const { studentId } = req.params;
            const result = await this.selectedSubjectService.join(studentId);
            const subjects = result.recordset;
            res.status(200).send({ subjects });
        } catch (error) {
            console.log("SelectedSubjectController -> getSubjects -> error", error)
            res.status(500).send();
        }
    }

    createSubject = async (req: Request, res: Response) => {
        try {
            const { subjectId, studentId, createdAt } = req.body;
            //Validation
            const validResult = SelectedSubjectSchema.validate(req.body, { abortEarly: false });
            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            const existedSubject = await this.selectedSubjectService.findBy(subjectId);
            if (check(existedSubject, 'EXISTED')) return res.status(400).send({ message: "Subject existed!" });

            const data = {
                SUBJECT_ID: subjectId,
                STUDENT_ID: studentId,
                CREATED_AT: createdAt
            };

            const subjectNew = await this.selectedSubjectService.create(data);
            if (check(subjectNew, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Đã chọn', id: subjectId });
        } catch (error) {
            console.log("SelectedSubjectController -> createComingSubject -> error", error)
            res.status(500).send();
        }
    }

    deleteSubject = async (req: Request, res: Response) => {
        try {
            const { subjectId, studentId } = req.body;
            const deletedSubject = await this.selectedSubjectService.delete(subjectId, studentId);
            if (check(deletedSubject, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Đã xoá' });
        } catch (error) {
            console.log("SelectedSubjectController -> deleteSubject -> error", error)
            res.status(500).send();
        }
    }
}

export default SelectedSubjectController;