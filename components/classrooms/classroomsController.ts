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

    getLectureClassrooms = async (req: ReqType, res: Response) => {
        try {
            const { id } = req;
            const { schoolYear, semester } = req.query;

            const semesterObj: { [index: string]: number } = { I: 1, II: 2, hè: 3 }

            const joinTimes = await this.classroomService.joinTimes();
            const splitTimes: { [index: string]: any } = {}
            const splitClassrooms: { [index: string]: any } = {}

            joinTimes.recordset.map((item: any) => {
                const time = { ...item }; delete time.classroomId;
                splitTimes[item.classroomId] ? splitTimes[item.classroomId].push(time) : splitTimes[item.classroomId] = time.id ? [time] : [];
            })

            const getAllClassrooms = await this.classroomService.getLectureClassrooms(id, schoolYear, semesterObj[semester]);

            getAllClassrooms.recordset.map((item: any) => {
                const classroom = { ...item, times: splitTimes[item.id] }; delete classroom.subjectId;
                splitClassrooms[item.subjectId] ? splitClassrooms[item.subjectId].push(classroom) : splitClassrooms[item.subjectId] = classroom.id ? [classroom] : [];
            })

            const joinSubject = await this.classroomService.joinSubject(id, schoolYear, semesterObj[semester]);

            const resultClassrooms = joinSubject.recordset.map((subject: any) => {
                return { subjectId: subject.subjectId.toString(), subjectName: subject.subjectName, classrooms: splitClassrooms[subject.subjectId] }
            })

            res.status(200).send(resultClassrooms);
        } catch (error) {
            console.log("ClassroomController -> getClassrooms -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getStudentClassrooms = async (req: ReqType, res: Response) => {
        try {
            const { id } = req;
            const { schoolYear, semester } = req.query;

            const semesterObj: { [index: string]: number } = { I: 1, II: 2, hè: 3 }

            const joinTimes = await this.classroomService.joinTimes();
            const splitTimes: { [index: string]: any } = {}

            joinTimes.recordset.map((item: any) => {
                const time = { ...item }; delete time.classroomId;
                splitTimes[item.classroomId] ? splitTimes[item.classroomId].push(time) : splitTimes[item.classroomId] = time.id ? [time] : [];
            })

            const getAllClassrooms = await this.classroomService.getStudentClassrooms(id, schoolYear, semesterObj[semester]);

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
    schoolYear: string;
    semester: string;
}

type ReqType = {
    id: string;
    role: string;
    query: QueryType;
}