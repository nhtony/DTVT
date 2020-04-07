import { Request, Response } from "express";
import { Controller } from "../../DI/Controller";
import MustSubjectSchema from './mustSubject';
import MustSubjectService from './mustSubjectService';


@Controller()
class MustSubjectController {

    constructor(protected mustSubjectService: MustSubjectService) { }

    getMustSubjects = async (req: Request, res: Response) => {
        try {
            const subjects = await this.mustSubjectService.findAll();
            res.status(200).send(subjects.recordset);
        } catch (error) {
            console.log("MustSubjectController -> getMustSubjects -> error", error)
            res.status(500).send();
        }
    }

    getMustSubjectById = async (req: Request, res: Response) => {
        try {
            const { mustSubId } = req.params;
            const subject = await this.mustSubjectService.findBy({ MA_MON_TQ: mustSubId });
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

            const mustObject = {
                MA_MON_TQ: mustSubId,
                TEN_MON_TQ: mustSubName,
                MA_MON_HOC: subId
            };

            const subjectNew = await this.mustSubjectService.createMustSubject(mustObject);

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

            const mustObject = {
                TEN_MON_TQ: mustSubName,
                MA_MON_HOC: subId
            };

            const subjectUpdated = await this.mustSubjectService.updateMustSubject(mustObject, { MA_MON_TQ: mustSubId});

            res.status(200).send(subjectUpdated.recorset);
        } catch (error) {
            console.log("MustSubjectController -> createMustSubject -> error", error)
            res.status(500).send();
        }
    }

    deleteMustSubject = async (req: Request, res: Response) => {
        try {
            const { mustSubId } = req.body;
            const subjectDeleted = await this.mustSubjectService.delete(mustSubId);
            res.status(200).send(subjectDeleted.recorset);
        } catch (error) {
            console.log("MustSubjectController -> createMustSubject -> error", error)
            res.status(500).send();
        }
    }

}

export default MustSubjectController;