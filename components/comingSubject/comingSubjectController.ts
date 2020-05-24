import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import ComingSubjectSchema from './comingSubject';
import ComingSubjectService from './comingSubjectService';
import { check } from '../../common/error';

@Controller()
class ComingSubjectController {

    constructor(protected comingSubjectService: ComingSubjectService) { }

    getSubjects = async (req: Request, res: Response) => {
        try {
            const pageNumber = Number(req.query.page);
            const rowPerPage = Number(req.query.limit);
            const result = await this.comingSubjectService.join(null, pageNumber, rowPerPage);
            const subjects = result.recordset;
            const count = await this.comingSubjectService.count();
            const { total } = count.recordset[0];
            res.status(200).send({ subjects, total });
        } catch (error) {
            console.log("ComingSubjectController -> getSubjects -> error", error)
            res.status(500).send();
        }
    }

    getSubjectsById = async (req: Request, res: Response) => {
        try {
            let { id } = req.params;
            const result = await this.comingSubjectService.findBy(id);
            const { recordset } = result;
            res.status(200).send(recordset[0]);
        } catch (error) {
            console.log("ComingSubjectController -> getSubjectsById -> error", error)
            res.status(500).send();
        }
    }

    updateSubject = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { semester, schoolYear } = req.body;
            const existedSubject = await this.comingSubjectService.findBy(id);
            if (!check(existedSubject, 'EXISTED')) return res.status(400).send({ message: "Electronic is not existed!" });
            const object = {
                SEMESTER: semester,
                SCHOOL_YEAR: schoolYear
            };
            const updated = await this.comingSubjectService.updateSubject(object, { SUBJECT_ID: id });
            if (check(updated, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Môn học vừa chỉnh sửa', id });
        } catch (error) {
            console.log("ComingSubjectController -> updateSubject -> error", error);
            res.status(500).send();
        }
    }

    createComingSubject = async (req: Request, res: Response) => {
        try {
            const { subjectId, semester, schoolYear } = req.body;
            //Validation
            const validResult = ComingSubjectSchema.validate(req.body, { abortEarly: false });
            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            const existedSubject = await this.comingSubjectService.findBy(subjectId);
            if (check(existedSubject, 'EXISTED')) return res.status(400).send({ message: "Subject existed!" });

            const data = {
                SUBJECT_ID: subjectId,
                SEMESTER: semester,
                SCHOOL_YEAR: schoolYear
            };

            const subjectNew = await this.comingSubjectService.create(data);
            if (check(subjectNew, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Môn học được mở', id: subjectId });
        } catch (error) {
            console.log("ComingSubjectController -> createComingSubject -> error", error)
            res.status(500).send();
        }
    }

    deleteSubject = async (req: Request, res: Response) => {
        try {
            const { subjectId, schoolYear } = req.body;
            console.log(req.body);
             
            const deletedSubject = await this.comingSubjectService.delete(subjectId, schoolYear);
            if (check(deletedSubject, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Đã xoá' });
        } catch (error) {
            console.log("ComingSubjectController -> deleteSubject -> error", error)
            res.status(500).send();
        }
    }
}

export default ComingSubjectController;