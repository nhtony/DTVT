import { Request, Response, NextFunction } from "express";
import { Controller } from "../../DI/Controller";
import ClassroomService from './classroomsService';
import StudentService from "../students/studentsService";
import { check } from '../../common/error';

@Controller()
class ClassroomController {
    private nextReq = {
        classroomInfo: {},
    };

    constructor(
        protected classroomService: ClassroomService,
        protected studentService: StudentService
    ) { }

    getLectureClassrooms = async (req: ReqType, res: Response) => {
        try {
            const { id } = req;
            const { schoolYear, semester } = req.query;

            const joinTimes = await this.classroomService.joinTimes();
            const splitTimes: { [index: string]: any } = {}
            const splitClassrooms: { [index: string]: any } = {}

            joinTimes.recordset.map((item: any) => {
                const time = { ...item }; delete time.classroomId;
                splitTimes[item.classroomId] ? splitTimes[item.classroomId].push(time) : splitTimes[item.classroomId] = time.id ? [time] : [];
            })

            const getAllClassrooms = await this.classroomService.getLectureClassrooms(id, schoolYear, semester);

            getAllClassrooms.recordset.map((item: any) => {
                const classroom = { ...item, times: splitTimes[item.id] }; delete classroom.subjectId;
                splitClassrooms[item.subjectId] ? splitClassrooms[item.subjectId].push(classroom) : splitClassrooms[item.subjectId] = classroom.id ? [classroom] : [];
            })

            const joinSubject = await this.classroomService.joinSubject(id, schoolYear, semester);

            const resultClassrooms = joinSubject.recordset.map((subject: any) => {
                return { subjectId: subject.subjectId.toString(), subjectName: subject.subjectName, classrooms: splitClassrooms[subject.subjectId] }
            })

            res.status(200).send(resultClassrooms);
        } catch (error) {
            console.log("ClassroomController -> getClassrooms -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getConsultants = async (req: ReqType, res: Response) => {
        try {
            const { id } = req;
            const now = new Date();
            const curYear = now.getFullYear();
            const howLong = 6; // lấy 6 năm gần nhất (đến năm t7 trường đuổi cmnr)
            const schoolYearRange = Array.from({ length: howLong }, (v, i) => `'${curYear - i - 1}-${curYear - i}'`);
            const consultants = await this.classroomService.getConsultants(id, schoolYearRange.join(', '));
            res.status(200).send(consultants.recordset);
        } catch (error) {
            console.log("ClassroomController -> getConsultants -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getGrades = async (req: ReqType, res: Response) => {
        try {
            const { id } = req;

            res.status(200).send();
        } catch (error) {
            console.log("ClassroomController -> getGrades -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getStudentClassrooms = async (req: ReqType, res: Response) => {
        try {
            const { id } = req;
            const { schoolYear, semester } = req.query;

            const joinTimes = await this.classroomService.joinTimes();
            const splitTimes: { [index: string]: any } = {}

            joinTimes.recordset.map((item: any) => {
                const time = { ...item }; delete time.classroomId;
                splitTimes[item.classroomId] ? splitTimes[item.classroomId].push(time) : splitTimes[item.classroomId] = time.id ? [time] : [];
            })

            const getAllClassrooms = await this.classroomService.getStudentClassrooms(id, schoolYear, semester);

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

    getClassroomWillOpen = async (req: Request, res: Response) => {
        try {
            const { schoolYear, semester } = req.query;

            const result = await this.classroomService.getClassroomWillOpen(schoolYear, semester);

            res.status(200).send(result);
        } catch (error) {
            console.log("ClassroomController -> getClassrooms -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getStudentList = async (req: ReqType, res: Response) => {
        try {
            const { classroomId } = req.query;
            const type = parseInt(req.query.type);

            let studentList = null;

            switch (type) {
                case 1:
                    studentList = await this.classroomService.getStudentList(classroomId);
                    break;

                case 2:
                    studentList = await this.classroomService.getStudentsInClass(classroomId);
                    break;

                default: new Error("Không có type đó");
            }

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
            const { studentId, classroomId, type } = req.body;
            
            const checkStatus: { [index: number]: string } = { 1: "Chỉ định", 0: "Bỏ chỉ định" }

            const existedStudent = await this.studentService.findBy({ MA_SINH_VIEN: studentId });
            if (!check(existedStudent, 'EXISTED')) return res.status(400).send({ message: 'Student not exist !' });

            const { HO_SINH_VIEN, TEN_SINH_VIEN } = existedStudent.recordset[0];
            const fullname = HO_SINH_VIEN + " " + TEN_SINH_VIEN;

            let appointLead = null;

            switch (parseInt(type)) {
                case 1:
                    appointLead = await this.classroomService.appointClassroomLead(studentId, classroomId, status);
                    break;

                case 2:
                    appointLead = await this.classroomService.appointClassLead(studentId, classroomId, status);
                    break;

                default: new Error("Không có type đó");
            }

            if (check(appointLead, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ status: checkStatus[status], fullname });
        } catch (error) {
            console.log("ClassroomController -> appointLead -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getInfoClassroom = async (req: ReqType, res: Response, next: NextFunction) => {
        try {
            const { classroomId } = req.query;
            const type = parseInt(req.query.type);

            let classroomInfo = null;

            switch (type) {
                case 1:
                    classroomInfo = await this.classroomService.getInfoClassroom(classroomId);
                    break;

                case 2:
                    classroomInfo = await this.classroomService.getInfoClass(classroomId);
                    break;

                default: new Error("Không có type đó");
            }

            const queryByType: { [index: number]: string } = {
                1: `FROM CLASSROOM_STUDENT_JUNCTION WHERE CLASSROOM_ID = '${classroomId}'`,
                2: `FROM SINH_VIEN WHERE MaLop = '${classroomId}'`
            }

            const listLength = await this.classroomService.countStudentInClass(queryByType[type]);

            this.nextReq.classroomInfo = { ...classroomInfo.recordset[0], studentListLength: listLength.recordset[0].count }

            req.role === "student" ? next() : res.status(200).send(this.nextReq.classroomInfo);
        } catch (error) {
            console.log("ClassroomController -> getInfoClassroom -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    checkLeads = async (req: ReqType, res: Response) => {
        try {
            const { classroomId } = req.query;
            const type = parseInt(req.query.type);

            let result = null;

            switch (type) {
                case 1:
                    result = await this.classroomService.checkClassroomLeads(classroomId, req.id);  
                    break;

                case 2:
                    result = await this.classroomService.checkClassLeads(classroomId, req.id);  
                    break;
            
                default:
                    break;
            }
            
            if (!check(result, 'EXISTED')) return res.status(400).send({ message: 'Student is not exist !' });

            const { isLead } = result.recordset[0];

            res.status(200).send({ ...this.nextReq.classroomInfo, isLead });
        } catch (error) {
            console.log("ClassroomController -> checkLeads -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    getCategory = async (req: ReqType, res: Response) => {
        try {
            const category = await this.classroomService.getCategory();
            const record = category.recordset;

            res.status(200).send(record);
        } catch (error) {
            console.log("ClassroomController -> getCategory -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }
}

export default ClassroomController;

type QueryType = {
    classroomId: string;
    type: string;
    schoolYear: string;
    semester: number;
}

type BodyType = {
    type: string;
    studentId: string;
    classroomId: string;
}

type ReqType = {
    id: string;
    role: string;
    query: QueryType;
    body: BodyType;
}