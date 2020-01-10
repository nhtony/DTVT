import { Request, Response } from "express";
import StudentService from './studentsService';


class StudentController {
    getStudents = async (req:Request, res:Response) => {
        try {
            const data = await StudentService.findAll();
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: module.exports.getCustomers -> err", error)
            res.status(500).send();
        }
    }

    getStudentById = async (req:Request, res:Response) => {
        try {
            const { id } = req.params;
            const data = await StudentService.findById(id);
            res.status(200).send(data.recordset);
        } catch (error) {
            console.log("TCL: module.exports.getCustomers -> err", error)
            res.status(500).send();
        }
    }
}

export default new StudentController();