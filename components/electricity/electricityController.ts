import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import ElectricityService from './electricityService';
import MustSubjectService from '../mustSubject/mustSubjectService';
import { check } from '../../common/error';

@Controller()
class ElectricityController {

    constructor(
        protected electricityService: ElectricityService,
        protected mustSubjectService: MustSubjectService
    ) { }

    getSubjects = async (req: Request, res: Response) => {
        try {
            const pageNumber = Number(req.query.page);
            const rowPerPage = Number(req.query.limit);
            const result = await this.electricityService.join(null, pageNumber, rowPerPage);
            const subjects = result.recordset;
            const count = await this.electricityService.count();
            const { total } = count.recordset[0];
            res.status(200).send({ subjects, total });
        } catch (error) {
            console.log("ElectricityController -> getSubjects -> error", error)
            res.status(500).send();
        }
    }

    getSubjectsBySemester = (majorId: string) => async (req: Request, res: Response) => {
        try {
            let { semester } = req.params;
            const result = await this.electricityService.join(majorId);
            const { recordset } = result;
            const subjects = recordset.filter((sub: any) => sub.semester == semester);
            res.status(200).send(subjects);
        } catch (error) {
            console.log("ElectricityController -> getSubjectBySemester -> error", error)
            res.status(500).send();
        }
    }

    getTreeSubjects = (majorId: string) => async (req: any, res: Response) => {

        try {
            const result = await this.electricityService.join(majorId);
            const subjects = result.recordset;
            const treeSubjects: { [index: string]: any } = {};

            const getMustSubs = async (id: string) => {
                const res = await this.mustSubjectService.findBy({ MA_MON_HOC: id });
                return res.recordset.length ? res.recordset : null;
            };

            await Promise.all(
                subjects.map(async (sub: any) => {
                    sub.musts = await getMustSubs(sub.id);
                    if (treeSubjects[sub.semester]) {
                        treeSubjects[sub.semester].subjects.push(sub);
                        treeSubjects[sub.semester].allNum += sub.number;
                    }
                    else {
                        treeSubjects[sub.semester] = { subjects: [sub], allNum: sub.number };
                    }
                }));

            res.status(200).send(treeSubjects);
        } catch (error) {
            console.log("ElectricityController -> getTreeSubjects -> error", error)
            res.status(500).send();
        }
    }

    updateSubjectType = async (req: Request, res: Response) => {
        try {
            let { id, subjectType } = req.body;
            const result = await this.electricityService.updateElectric({ MA_LOAI_MON: subjectType }, { MA_MON_HOC: id });
            res.status(200).send(result.recordset);
        } catch (error) {
            console.log("ElectricityController -> addSubjectType -> error", error)
            res.status(500).send();
        }
    }

    updateSemester = async (req: Request, res: Response) => {
        try {
            let { id, semester } = req.body;
            const result = await this.electricityService.updateElectric({ HOC_KY: semester }, { MA_MON_HOC: id });
            res.status(200).send(result.recordset);
        } catch (error) {
            console.log("ElectricityController -> updateSemester -> error", error)
            res.status(500).send();
        }
    }

    deleteSubject = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedSubject = await this.electricityService.delete(id);
            if (check(deletedSubject, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Success!' });
        } catch (error) {
            console.log("ElectricityController -> deleteSubject -> error", error)
            res.status(500).send();
        }
    }
}

export default ElectricityController;