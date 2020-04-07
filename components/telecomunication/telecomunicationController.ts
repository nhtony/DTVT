import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import TelecomunicationService from './telecomunicationService';
import MustSubjectService from '../mustSubject/mustSubjectService';

@Controller()
class TelecomunicationController {

    constructor(
        protected telecomnunicationService: TelecomunicationService,
        protected mustSubjectService: MustSubjectService
    ) { }

    getSubjects = async (req: Request, res: Response) => {  
        try {
            const result = await this.telecomnunicationService.join();
            const subjects = result.recordset;
            res.status(200).send(subjects);
        } catch (error) {
            console.log("TelecomunicationController -> getSubjects -> error", error)
            res.status(500).send();
        }
    }


    getSubjectsBySemester = async (req: Request, res: Response) => {
        try {
            let { semester } = req.params;
            const result = await this.telecomnunicationService.join();
            const { recordset } = result;
            const subjects = recordset.filter((sub: any) => sub.semester == semester);
            res.status(200).send(subjects);
        } catch (error) {
            console.log("TelecomunicationController -> getSubjectBySemester -> error", error)
            res.status(500).send();
        }
    }


    getTreeSubjects = async (req: Request, res: Response) => {
        try {
            const result = await this.telecomnunicationService.join();
            const subjects = result.recordset;        
            const treeSubjects: { [index: string]: any } = {};
          
            const getMustSubs = async (id: string) => {
                const res = await this.mustSubjectService.findBy({MA_MON_HOC: id});
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
            console.log("TelecomunicationController -> getTreeSubjects -> error", error);
            res.status(500).send();
        }
    }

    updateSubjectType = async (req: Request, res: Response) => {
        try {
            let { id, subjectType } = req.body;
            const result = await this.telecomnunicationService.updateTele({MA_LOAI_MON:subjectType}, {MA_MON_HOC:id});
            res.status(200).send(result.recordset);
        } catch (error) {
            console.log("TelecomunicationController -> addSubjectType -> error", error)
            res.status(500).send();
        }
    }

    updateSemester = async (req: Request, res: Response) => {
        try {
            let { id, semester } = req.body;
            const result = await this.telecomnunicationService.updateTele({HOC_KY:semester}, {MA_MON_HOC:id});
            res.status(200).send(result.recordset);
        } catch (error) {
            console.log("TelecomunicationController -> updateSemester -> error", error)
            res.status(500).send();
        }
    }
}

export default TelecomunicationController;