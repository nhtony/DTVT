interface IStudent {
    findAll: () => {};
    findById: (id: string) => {};
    findBirthById: (id: string) => {};
    findEmail: (email: string) => {};
    create: (id: string, firstname: string, lastname: string, birth: Date, email: string, phone: string, classId: string, groupId: string) => {};
    update: (id: string, firstname: string, lastname: string, birth: Date, email: string, phone: string, classId: string, groupId: string) => {};
    updateEmailById: (email: string, id: string) => {};
    updateRoleById: (role: number, id: string) => {};
    delete: (id: string) => {};
}

export default IStudent;