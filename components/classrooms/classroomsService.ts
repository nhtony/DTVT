import { Service } from "../../DI/ServiceDecorator";
import IClassroom from "./classroomsBase";
import CRUD from "../../base/CRUD";

const NAME = 'CLASSROOM';

@Service()
class ClassroomService extends CRUD implements IClassroom {

    constructor() {
        super();
        this.createConnectionPool(NAME);
    }

    async getStudentClassrooms(studentId: string, schoolYear: string, semester: number) {
        return await this.pool.query(`
            SELECT 
                csj.CLASSROOM_ID AS id,
                c.SUBJECT_ID AS subjectId,
                c.THEORY AS theory,
                c.PRACTICE AS practice,
                s.TEN_MON_HOC AS subjectName,
                s.SO_TIN_CHI AS credits,
                g.HO_GIANG_VIEN AS firstName,
                g.TEN_GIANG_VIEN AS lastName
            FROM CLASSROOM_STUDENT_JUNCTION csj
                INNER JOIN CLASSROOM c
                    ON c.CLASSROOM_ID = csj.CLASSROOM_ID
                INNER JOIN MON_HOC s
                    ON s.MA_MON_HOC = c.SUBJECT_ID
                INNER JOIN GIANG_VIEN g
                    ON g.MA_GIANG_VIEN = c.LECTURE_ID
            WHERE STUDENT_ID = '${studentId}'
                AND SCHOOL_YEAR = '${schoolYear}'
                    AND SEMESTER ='${semester}'
        `)
    }

    async getLectureClassrooms(lectureId: string, schoolYear: string, semester: number) {
        return await this.pool.query(`
            SELECT
                CLASSROOM_ID AS id,
                SUBJECT_ID AS subjectId,
                THEORY AS theory,
                PRACTICE AS practice
            FROM CLASSROOM
            WHERE LECTURE_ID = '${lectureId}'
                AND SCHOOL_YEAR = '${schoolYear}'
                    AND SEMESTER ='${semester}'
        `)
    }

    async getConsultants(lectureId: string, schoolYearRange: string) {
        return await this.pool.query(`
            SELECT CLASS_ID AS classId 
            FROM CLASS 
            WHERE CONSULTANT = '${lectureId}'
                AND SCHOOL_YEAR IN (${schoolYearRange})
        `)
    }

    async joinSubject(lectureId: string, schoolYear: string, semester: number) {
        return await this.pool.query(`
            SELECT DISTINCT
                c.SUBJECT_ID AS subjectId,
                s.TEN_MON_HOC AS subjectName
            FROM CLASSROOM c
                INNER JOIN MON_HOC s
                    ON s.MA_MON_HOC = c.SUBJECT_ID
            WHERE LECTURE_ID = '${lectureId}'
                AND SCHOOL_YEAR = '${schoolYear}'
                    AND SEMESTER ='${semester}'
        `)
    }

    async joinTimes() {
        return await this.pool.query(`
            SELECT
                c.CLASSROOM_ID AS classroomId,
                t.TIME_ID AS id,
                t.TIME AS day,
                t.ROOM AS room,
                t.PERIOD_START AS start,
                t.COUNT_PERIOD AS count
            FROM CLASSROOM c
                LEFT JOIN CLASSROOM_TIME t
                    ON t.CLASSROOM_ID = c.CLASSROOM_ID
        `)
    }
    
    async createClassroom(obj: any) {
        const { classroomId, lectureId, subjectId, theory, practice, endPercent, examForms, schoolYear, semester, day, room, start, count, students } = obj;
        return await this.pool.query(`
            INSERT INTO CLASSROOM (CLASSROOM_ID, SUBJECT_ID, LECTURE_ID, THEORY, PRACTICE, SEMESTER, SCHOOL_YEAR, END_PERCENT, EXAM_FORMS)
            VALUES ('${classroomId}', '${subjectId}', '${lectureId}', '${theory}', '${practice}', '${semester}', '${schoolYear}', '${endPercent}', N'${examForms}')
            INSERT INTO CLASSROOM_TIME (CLASSROOM_ID, TIME, ROOM, PERIOD_START, COUNT_PERIOD)
            VALUES ('${classroomId}', '${day}', '${room}', '${start}', '${count}')
            INSERT INTO CLASSROOM_STUDENT_JUNCTION (CLASSROOM_ID, STUDENT_ID)
            VALUES (${students.join('),(')})
        `)
    }

    async getStudentList(classroomId: string) {
        return await this.pool.query(`
            SELECT 
                csj.IS_LEAD AS isLead,
                s.MA_SINH_VIEN AS studentId,
                s.HO_SINH_VIEN AS firstName,
                s.TEN_SINH_VIEN AS lastName,
                s.MaLop AS classId,
                s.SDT AS phone,
                s.EMAIL AS email
            FROM CLASSROOM_STUDENT_JUNCTION csj
                INNER JOIN SINH_VIEN s
                    ON s.MA_SINH_VIEN = csj.STUDENT_ID
            WHERE CLASSROOM_ID = '${classroomId}'
        `)
    }

    async getStudentsInClass(classId: string) {
        return await this.pool.query(`
        SELECT 
            Lead AS isLead,
            MA_SINH_VIEN AS studentId,
            HO_SINH_VIEN AS firstName,
            TEN_SINH_VIEN AS lastName,
            MaLop AS classId,
            SDT AS phone,
            EMAIL AS email
        FROM SINH_VIEN
        WHERE MaLop = '${classId}'
    `)
    }

    async getClassroomWillOpen(schoolYear: string, semester: number) {
        return await this.pool.query(`
        SELECT 
            WILL_OPEN_ID AS id,
            SUBJECT_ID AS subjectId,
            SEMESTER AS semester,
            SCHOOL_YEAR AS schoolYear
        FROM MON_HOC_SAP_MO
        WHERE SCHOOL_YEAR = '${schoolYear}'
            AND SEMESTER ='${semester}'
    `)
    }

    async getInfoClassroom(classroomId: string) {
        return await this.pool.query(`
            SELECT 
                c.SUBJECT_ID AS subjectId,
                c.THEORY AS theory,
                c.PRACTICE AS practice,
                s.TEN_MON_HOC AS name,
                s.SO_TIN_CHI AS credits,
                gv.HO_GIANG_VIEN AS firstName,
                gv.TEN_GIANG_VIEN AS lastName
            FROM CLASSROOM c
                INNER JOIN GIANG_VIEN gv
                    ON gv.MA_GIANG_VIEN = c.LECTURE_ID
                INNER JOIN MON_HOC s
                    ON s.MA_MON_HOC = c.SUBJECT_ID
            WHERE CLASSROOM_ID = '${classroomId}'
        `)
    }

    async getInfoClass(classId: string) {
        return await this.pool.query(`
        SELECT
            c.CLASS_ID AS name,
            gv.HO_GIANG_VIEN AS firstName,
            gv.TEN_GIANG_VIEN AS lastName
        FROM CLASS c
            INNER JOIN GIANG_VIEN gv
                ON gv.MA_GIANG_VIEN = c.CONSULTANT
        WHERE CLASS_ID = '${classId}'
    `)
    }

    async findById(classroomId: string) {
        return await this.pool.query(`
            SELECT * FROM CLASSROOM WHERE CLASSROOM_ID = '${classroomId}'
        `)
    }

    async checkClassroomLeads(classroomId: string, studentId: string) {
        return await this.pool.query(`
            SELECT IS_LEAD AS isLead
            FROM CLASSROOM_STUDENT_JUNCTION
            WHERE STUDENT_ID = '${studentId}'
                AND CLASSROOM_ID = '${classroomId}'
        `)
    }

    async checkClassLeads(classroomId: string, studentId: string) {
        return await this.pool.query(`
            SELECT Lead AS isLead
            FROM SINH_VIEN
            WHERE MA_SINH_VIEN = '${studentId}'
                AND MaLop = '${classroomId}'
        `)
    }

    async countStudentInClass(queryByType: string) {
        return await this.pool.query(`SELECT COUNT(*) AS count ${queryByType}`)
    }

    async appointClassroomLead(studentId: string, classroomId: string, status: number) {
        return await this.pool.query(`
            UPDATE CLASSROOM_STUDENT_JUNCTION 
            SET IS_LEAD = '${status}'
            WHERE STUDENT_ID = '${studentId}'
                AND CLASSROOM_ID = '${classroomId}'
        `)
    }

    async appointClassLead(studentId: string, classroomId: string, status: number) {
        return await this.pool.query(`
            UPDATE SINH_VIEN 
            SET Lead = '${status}'
            WHERE MA_SINH_VIEN = '${studentId}'
                AND MaLop = '${classroomId}'
        `)
    }

    async getCategory() {
        return await this.pool.query(`SELECT TYPE_ID AS typeId, TYPE_NAME AS typeName, ACRONYM AS acronym FROM POST_TYPE`)
    }

    async getScores(studentId: string) {
        return await this.pool.query(`
            SELECT 
                csj.CLASSROOM_STUDENT_ID AS id,
                csj.CLASSROOM_ID AS classroomId,
                csj.MID_SCORE AS midScore,
                csj.END_SCORE AS endScore,
                c.SUBJECT_ID AS subjectId,
                c.END_PERCENT AS endPercent,
                c.EXAM_FORMS AS examForms,
                s.TEN_MON_HOC AS subjectName,
                s.SO_TIN_CHI AS credits
            FROM CLASSROOM_STUDENT_JUNCTION csj
                INNER JOIN CLASSROOM c
                    ON c.CLASSROOM_ID = csj.CLASSROOM_ID
                INNER JOIN MON_HOC s
                    ON s.MA_MON_HOC = c.SUBJECT_ID
            WHERE STUDENT_ID = '${studentId}'
        `)
    }
}

export default ClassroomService;