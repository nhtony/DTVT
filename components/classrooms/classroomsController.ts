import { Response } from "express";
import { Controller } from "../../DI/Controller";
import ClassroomService from './classroomsService';
import StudentService from "../students/studentsService";
import { check } from '../../common/error';

@Controller()
class ClassroomController {

    constructor(
        protected classroomService: ClassroomService,
        protected studentService: StudentService
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

            let leads: any[] = [];
            let members: any[] = [];

            for (let item of studentList.recordset) {
                if (item.isLead) leads.push(item);
                else members.push(item);
            }

            const result = { "Quản trị viên": leads, "Thành viên": members };

            res.status(200).send(result);
        } catch (error) {
            console.log("ClassroomController -> getStudentList -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    appointLead = (status: number) => async (req: ReqType, res: Response) => {
        try {
            const { studentId, classroomId } = req.body;

            const checkStatus: { [index: number]: string } = { 1: "Chỉ định", 0: "Bỏ chỉ định" }

            const existedStudent = await this.studentService.findBy({ MA_SINH_VIEN: studentId });
            if (!check(existedStudent, 'EXISTED')) return res.status(400).send({ message: 'Student not exist !' });

            const { HO_SINH_VIEN, TEN_SINH_VIEN } = existedStudent.recordset[0];
            const fullname = HO_SINH_VIEN + " " + TEN_SINH_VIEN;

            const appointLead = await this.classroomService.appointLead(studentId, classroomId, status);
            if (check(appointLead, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ status: checkStatus[status], fullname });
        } catch (error) {
            console.log("ClassroomController -> appointLead -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getInfoClassroom = async (req: ReqType, res: Response) => {
        try {
            const { classroomId } = req.query;

            const classroomInfo = await this.classroomService.getInfoClassroom(classroomId);
            const listLength = await this.classroomService.countStudentInClass(classroomId);

            const result = { ...classroomInfo.recordset[0], studentListLength: listLength.recordset[0].count }

            res.status(200).send(result);
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

type BodyType = {
    studentId: string;
    classroomId: string;
}

type ReqType = {
    id: string;
    role: string;
    query: QueryType;
    body: BodyType;
}