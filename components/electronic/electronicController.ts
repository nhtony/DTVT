import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import ElectronicService from './electronicService';
import MustSubjectService from '../mustSubject/mustSubjectService';

@Controller()
class ElectronicController {

    constructor(
        protected electronicService: ElectronicService,
        protected mustSubjectService: MustSubjectService
    ) { }

    getSubjects = async (req: Request, res: Response) => {
        try {
            const result = await this.electronicService.join();
            const subjects = result.recordset;
            res.status(200).send(subjects);
        } catch (error) {
            console.log("ElectronicController -> getSubjects -> error", error)
            res.status(500).send();
        }
    }

    getSubjectsByMajor = (majorId: string) => async (req: Request, res: Response) => {
        try {
            const result = await this.electronicService.join(majorId);
            const subjects = result.recordset;
            res.status(200).send(subjects);
        } catch (error) {
            console.log("ElectronicController -> getSubjects -> error", error)
            res.status(500).send();
        }
    }

    getSubjectsBySemester = (majorId: string) => async (req: Request, res: Response) => {
        try {
            let { semester } = req.params;
            const result = await this.electronicService.join(majorId);
            const { recordset } = result;
            const subjects = recordset.filter((sub: any) => sub.semester == semester);
            res.status(200).send(subjects);
        } catch (error) {
            console.log("ElectronicController -> getSubjectBySemester -> error", error)
            res.status(500).send();
        }
    }


    getTreeSubjects = (majorId: string) => async (req: Request, res: Response) => {
        try {
            const result = await this.electronicService.join(majorId);
            const subjects = result.recordset;
            const treeSubjects: { [index: string]: any } = {};

            const getMustSubs = async (id: string) => {
                const res = await this.mustSubjectService.findBySubjectId(id);
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
            console.log("ElectronicController -> getTreeSubjects -> error", error)
            res.status(500).send();
        }
    }

    updateSubjectType = async (req: Request, res: Response) => {
        try {
            let { id, subjectType } = req.body;
            const result = await this.electronicService.updateSubjectType(id, subjectType);
            res.status(200).send(result.recordset);
        } catch (error) {
            console.log("ElectronicController -> addSubjectType -> error", error)
            res.status(500).send();
        }
    }

    updateSemester = async (req: Request, res: Response) => {
        try {
            let { id, semester } = req.body;
            const result = await this.electronicService.updateSemester(id, semester);
            res.status(200).send(result.recordset);
        } catch (error) {
            console.log("ElectronicController -> updateSemester -> error", error)
            res.status(500).send();
        }
    }
}

export default ElectronicController;