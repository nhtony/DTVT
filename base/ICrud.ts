interface ICrud {
    findAll: () => {};
    findById: (id: string) => {};
    create: () => {};
    update: () => {};
    delete: () => {};
};
export default ICrud;