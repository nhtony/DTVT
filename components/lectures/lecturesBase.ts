interface ILecture {
    findAll: () => {};
    findById: (id: string) => {};
    create: (id: string, firstname: string, lastname: string, email: string, phone: string, address: string, khoaId: string) => {}
    update: (id: string, firstname: string, lastname: string, email: string, phone: string, address: string, khoaId: string) => {};
    delete: (id:string) => {};
}

export default ILecture;