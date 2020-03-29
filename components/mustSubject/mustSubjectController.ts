import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import MustSubjectSchema from './mustSubject';
import MustSubjectService from './mustSubjectService';


@Controller()
class MustSubjectController {

    constructor(protected electronicService: MustSubjectService) { }

    getMustSubjects = async (req: Request, res: Response) => {
        try {
            const subjects = this.electronicService.findAll();
            res.status(200).send(subjects);
        } catch (error) {
            console.log("MustSubjectController -> getMustSubjects -> error", error)
            res.status(500).send();
        }
    }

    getMustSubjectById = async (req: Request, res: Response) => {
        try {
            const { mustSubId } = req.params;
            const subject = await this.electronicService.findById(mustSubId);
            res.status(200).send(subject.recorset);
        } catch (error) {
            console.log("MustSubjectController -> getMustSubjectById -> error", error);
            res.status(500).send();
        }
    }

    createMustSubject = async (req: Request, res: Response) => {
        try {
            const { mustSubId, mustSubName, subId } = req.body;

            //Validation
            const validResult = MustSubjectSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            const subjectNew = await this.electronicService.create(mustSubId, mustSubName, subId);

            res.status(200).send(subjectNew.recorset);
        } catch (error) {
            console.log("MustSubjectController -> createMustSubject -> error", error)
            res.status(500).send();
        }
    }

    updateMustSubject = async (req: Request, res: Response) => {
        try {
            const { mustSubId, mustSubName, subId } = req.body;

            //Validation
            const validResult = MustSubjectSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            const subjectUpdated = await this.electronicService.update(mustSubId, mustSubName, subId);
            
            res.status(200).send(subjectUpdated.recorset);
        } catch (error) {
            console.log("MustSubjectController -> createMustSubject -> error", error)
            res.status(500).send();
        }
    }

    deleteMustSubject = async (req: Request, res: Response) => {
        try {
            const { mustSubId } = req.body;
            const subjectDeleted = await this.electronicService.delete(mustSubId);
            res.status(200).send(subjectDeleted.recorset);
        } catch (error) {
            console.log("MustSubjectController -> createMustSubject -> error", error)
            res.status(500).send();
        }
    }

}

export default MustSubjectController;