import { Request, Response } from "express";
import studentSchema from './student';
import StudentService from './studentsService';
class StudentController {
    getStudents = async (req: Request, res: Response) => {
        try {
            const data = await StudentService.findAll();
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: StudentController -> getStudents -> error", error)

            res.status(500).send();
        }
    }

    getStudentById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = await StudentService.findById(id);
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: StudentController -> getStudentById -> error", error)

            res.status(500).send();
        }
    }

    createStudent = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = studentSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { id, firstname, lastname, birth, email, phone, classId, groupId } = req.body;

            // if (!email || !phone || !groupId) {
            //     email = null;
            //     phone = null;
            //     groupId = null;
            // }



            //Check lecutre đã tồn tại chưa
            const existedStudent = await StudentService.findById(id);
            if (existedStudent.recordset.length) return res.status(400).send({ message: "Student existed!" });

            const newStudent = await StudentService.create(id, firstname, lastname, birth, email, phone, classId, groupId);

            if (newStudent.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });

            res.status(200).send({ massage: 'Successful!' });

        } catch (error) {
            console.log("TCL: StudentController -> createStudent -> error", error)

            res.status(500).send({ error: 'Fail!' });
        }
    }

    updateStudent = async (req: Request, res: Response) => {
        try {

            //Validation
            const validResult = studentSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            let { id, firstname, lastname, birth, email, phone, classId, groupId } = req.body;

            // if (!email || !phone || !groupId) {
            //     email = null;
            //     phone = null;
            //     groupId = null;
            // }

            //Check lecutre đã tồn tại chưa
            const existedStudent = await StudentService.findById(id);
            if (!existedStudent.recordset.length) return res.status(400).send({ message: "Student not exist!" });

            const updatedStudent = await StudentService.update(id, firstname, lastname, birth, email, phone, classId, groupId);

            if (updatedStudent.rowsAffected.length === 0) return res.status(500).send({ massage: 'Fail!' });

            res.status(200).send({ massage: 'Successful!' });

        } catch (error) {
            console.log("TCL: StudentController -> updateStudent -> error", error)

            res.status(500).send();
        }
    }

    deleteStudent = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedStudent = await StudentService.delete(id);
            if (!deletedStudent.rowsAffected.length) return res.status(500).send({ massage: 'Fail!' });
            res.status(200).send({ massage: 'Success!' });
        } catch (error) {
            console.log("TCL: StudentController -> deleteStudent -> error", error)
            res.status(500).send();
        }
    }
}

export default new StudentController();