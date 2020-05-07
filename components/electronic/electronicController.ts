import { Request, Response, NextFunction } from "express";
import { Controller } from "../../DI/Controller";
import electricShema from './electronic';
import ElectronicService from './electronicService';
import MustSubjectService from '../mustSubject/mustSubjectService';
import { check } from '../../common/error';

@Controller()
class ElectronicController {

    constructor(
        protected electronicService: ElectronicService,
        protected mustSubjectService: MustSubjectService
    ) { }

    getSubjects = async (req: Request, res: Response) => {
        try {
            const pageNumber = Number(req.query.page);
            const rowPerPage = Number(req.query.limit);
            const result = await this.electronicService.join(null, pageNumber, rowPerPage);
            const subjects = result.recordset;
            const count = await this.electronicService.count();
            const { total } = count.recordset[0];
            res.status(200).send({ subjects, total });
        } catch (error) {
            res.status(500).send();
        }
    }


    getSubjectsById = async (req: Request, res: Response) => {
        try {
            let { id } = req.params;
            const result = await this.electronicService.findOne(id);
            const { recordset } = result;
            res.status(200).send(recordset[0]);
        } catch (error) {
            console.log("ElectronicController -> getSubjectsById -> error", error)
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
            console.log("ElectronicController -> getTreeSubjects -> error", error)
            res.status(500).send();
        }
    }

    createdElectronic = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Validation
            const validResult = electricShema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });
            let { id, industry, major, type, semester, name, number } = req.body;

            const existedSubject = await this.electronicService.findBy({ MA_MON_HOC: id });
            if (check(existedSubject, 'EXISTED')) return res.status(400).send({ message: "Subject existed!" });

            const subjectObject = {
                MA_MON_HOC: id,
                MA_NHOM_NGANH: industry,
                MA_NGANH: major,
                MA_CHUYEN_NGANH: 'dt',
                MA_LOAI_MON: type,
                HOC_KY: semester
            };

            const newSubject = await this.electronicService.createElectro(subjectObject);
            if (check(newSubject, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail in electronic!' });

            req.id = id;
            req.name = name;
            req.number = number;
            next();

        } catch (error) {
            console.log("ElectronicController -> createdElectronic -> error", error);
        }
    }

    updateSubject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { industry, major, type, semester, number, name } = req.body;
            const existedSubject = await this.electronicService.findBy({ MA_MON_HOC: id });
            if (!check(existedSubject, 'EXISTED')) return res.status(400).send({ message: "Electronic is not existed!" });
            const object = {
                MA_NHOM_NGANH: industry,
                MA_NGANH: major,
                MA_LOAI_MON: type,
                HOC_KY: semester
            };
            const updatedEle = await this.electronicService.updateElectro(object, { MA_MON_HOC: id });
            if (check(updatedEle, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            req.id = id;
            req.name = name;
            req.number = number;
            next();

        } catch (error) {
            console.log("ElectronicController -> updateSubject -> error", error);
            res.status(500).send();
        }
    }

    updateSubjectType = async (req: Request, res: Response) => {
        try {
            let { id, subjectType } = req.body;
            const result = await this.electronicService.updateElectro({ MA_LOAI_MON: subjectType }, { MA_MON_HOC: id });
            res.status(200).send(result.recordset);
        } catch (error) {
            console.log("ElectronicController -> addSubjectType -> error", error)
            res.status(500).send();
        }
    }

    updateSemester = async (req: Request, res: Response) => {
        try {
            let { id, semester } = req.body;
            const result = await this.electronicService.updateElectro({ HOC_KY: semester }, { MA_MON_HOC: id });
            res.status(200).send(result.recordset);
        } catch (error) {
            console.log("ElectronicController -> updateSemester -> error", error)
            res.status(500).send();
        }
    }

    deleteSubject = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedSubject = await this.electronicService.delete(id);
            if (check(deletedSubject, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Success!' });
        } catch (error) {
            console.log("TCL: SubjectsController -> deleteLecture -> error", error)
            res.status(500).send();
        }
    }
}

export default ElectronicController;