interface ISubject {
    findAll: () => {};
    findById: (subjectId: string) => {};
    create: (subjectId: string, name: string, number: string, required: number, status: string) => {}
    update: (subjectId: string, name: string, number: string, required: number, status: string) => {};
    updateStatus: (subjectId: string, status: number) => {};
    delete: (subjectId: string) => {};
}

export default ISubject;