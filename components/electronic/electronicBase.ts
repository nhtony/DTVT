interface IElectronic {
    findAll: () => {};
    findById: (subjectId: string) => {};
    create: (subjectId: string, groupMajorId: string, majorId: string, specMajorId: string) => {};
    update: (subjectId: string, groupMajorId: string, majorId: string, specMajorId: string) => {};
    delete: (subjectId: string) => {};
    join: (subjectId: string) => {};
}
export default IElectronic;