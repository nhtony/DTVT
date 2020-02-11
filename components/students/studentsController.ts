import { Request, Response } from "express";
import { Controller } from '../../DI/Controller';
import studentSchema from './student';
import StudentService from './studentsService';
import { check } from '../../common/error';

@Controller()
class StudentController {
    constructor(protected stundentService: StudentService) { }
    getStudents = async (req: Request, res: Response) => {
        try {
            const data = await this.stundentService.findAll();
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: StudentController -> getStudents -> error", error)
            res.status(500).send();
        }
    }

    getStudentById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = await this.stundentService.findById(id);
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

            //Check lecutre đã tồn tại chưa
            const existedStudent = await this.stundentService.findById(id);
            if (check(existedStudent, 'EXISTED')) return res.status(400).send({ message: "Student existed!" });

            const newStudent = await this.stundentService.create(id, firstname, lastname, birth, email, phone, classId, groupId);

            if (check(newStudent, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!', new: newStudent.recordset[0] });

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

            //Check lecutre đã tồn tại chưa
            const existedStudent = await this.stundentService.findById(id);
            if (!check(existedStudent, 'EXISTED')) return res.status(400).send({ message: "Student not exist!" });

            const updatedStudent = await this.stundentService.update(id, firstname, lastname, birth, email, phone, classId, groupId);

            if (check(updatedStudent, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Successful!', update: updatedStudent.recordset[0] });

        } catch (error) {
            console.log("TCL: StudentController -> updateStudent -> error", error)
            res.status(500).send();
        }
    }

    deleteStudent = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const deletedStudent = await this.stundentService.delete(id);
            if (check(deletedStudent, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });
            res.status(200).send({ message: 'Success!', deleteId: id });
        } catch (error) {
            console.log("TCL: StudentController -> deleteStudent -> error", error)
            res.status(500).send();
        }
    }
}

export default StudentController;