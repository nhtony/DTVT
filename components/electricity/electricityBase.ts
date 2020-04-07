interface IElectricity {
    findAll: () => {};
    findById: (subjectId: string) => {};
    create: (subjectId: string, groupMajorId: string, majorId: string, specMajorId: string,semester:string) => {};
    update: (subjectId: string, groupMajorId: string, majorId: string, specMajorId: string) => {};
    delete: (subjectId: string) => {};
    join: (subjectId: string) => {};
}
export default IElectricity;