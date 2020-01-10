
interface StudentDAL {
    findAll: () => {};
    findById: (id:string) => {};
    updateEmailById: (email: string, id:string) => {};
}

export default StudentDAL;