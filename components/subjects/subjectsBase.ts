interface ISubject {
    findAll: () => {};
    findById: (subjectId: string) => {};
    create: (subjectId: string, name: string, number: string, required: number, majorId: string) => {}
    update: (subjectId: string, name: string, number: string, required: number, majorId: string) => {};
    delete: (subjectId:string) => {};
}

export default ISubject;