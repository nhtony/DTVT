import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import ElectronicSchema from './electronicBase';
import ElectronicService from './electronicService';
import { check } from '../../common/error';

@Controller()
class ElectronicController {

    constructor(protected electronicService: ElectronicService) { }

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
            const {recordset} = result;
            const subjects = recordset.filter((sub:any)=> sub.semester == semester);
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

            subjects.forEach((element: any) => {

                if (treeSubjects[element.semester]) {
                    treeSubjects[element.semester].subjects.push(element);
                    treeSubjects[element.semester].allNum += element.number;
                }
                else {
                    treeSubjects[element.semester] = { subjects: [element], allNum: element.number };

                }
            });

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