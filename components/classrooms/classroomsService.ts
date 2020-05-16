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

    async getInfoClassroom(classroomId: string) {
        return await this.pool.query(`
            SELECT 
                c.SUBJECT_ID AS subjectId,
                c.THEORY AS theory,
                c.PRACTICE AS practice,
                s.TEN_MON_HOC AS subjectName,
                s.SO_TIN_CHI AS credits,
                g.MA_GIANG_VIEN AS lectureId,
                g.HO_GIANG_VIEN AS firstName,
                g.TEN_GIANG_VIEN AS lastName,
                g.EMAIL AS email,
                g.DIEN_THOAI AS phone
            FROM CLASSROOM c
                INNER JOIN GIANG_VIEN g
                    ON g.MA_GIANG_VIEN = c.LECTURE_ID
                INNER JOIN MON_HOC s
                    ON s.MA_MON_HOC = c.SUBJECT_ID
            WHERE CLASSROOM_ID = '${classroomId}'
        `)
    }

    async countStudentInClass(classroomId: string) {
        return await this.pool.query(`
            SELECT COUNT(*) AS count
            FROM CLASSROOM_STUDENT_JUNCTION
            WHERE CLASSROOM_ID = '${classroomId}'
        `)
    }

    async appointLead(studentId: string, classroomId: string, status: number) {
        return await this.pool.query(`
            UPDATE CLASSROOM_STUDENT_JUNCTION 
            SET IS_LEAD = '${status}'
            WHERE STUDENT_ID = '${studentId}'
                AND CLASSROOM_ID = '${classroomId}'
        `)
    }

    async getCategory() {
        return await this.pool.query(`SELECT TYPE_ID AS typeId, TYPE_NAME AS typeName, ACRONYM AS acronym FROM POST_TYPE`)
    }
}

export default ClassroomService;