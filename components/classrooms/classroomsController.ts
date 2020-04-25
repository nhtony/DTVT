import { Request, Response, NextFunction } from "express";
import { Controller } from "../../DI/Controller";
import classroomSchema from "./classroom";
import ClassroomService from './classroomsService';
import { check } from '../../common/error';

@Controller()
class ClassroomController {

    constructor(
        protected classroomService: ClassroomService
    ) { }

    getClassrooms = async (req: ReqType, res: Response) => {
        try {
            const joinTimes = await this.classroomService.joinTimes();
            const splitTimes: { [index: string]: any } = {}

            joinTimes.recordset.map((item: any) => {
                const time = { ...item }; delete time.classroomId;
                splitTimes[item.classroomId] ? splitTimes[item.classroomId].push(time) : splitTimes[item.classroomId] = time.id ? [time] : [];
            })

            const getAllClassrooms = await this.classroomService.getStudentClassrooms(req.id);

            const resultClassrooms = getAllClassrooms.recordset.map((classroom: any) => {
                classroom.id = classroom.id.toString();
                return { ...classroom, times: splitTimes[classroom.id] }
            })

            res.status(200).send(resultClassrooms);
        } catch (error) {
            console.log("ClassroomController -> getClassrooms -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getStudentList = async (req: ReqType, res: Response) => {
        try {
            const { classroomId } = req.query;
            const studentList = await this.classroomService.getStudentList(classroomId);
            res.status(200).send(studentList.recordset);
        } catch (error) {
            console.log("ClassroomController -> getStudentList -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }
}

export default ClassroomController;

type QueryType = {
    classroomId: string;
}

type ReqType = {
    id: string;
    query: QueryType;
}