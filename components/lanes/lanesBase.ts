interface ILanes {
    findAll: () => {};
    findById: (id: number) => {};
    create: (title: string, label: string) => {};
    update: (id: number, title: string, label: string) => {};
    delete: (id: number) => {};
    join: (id:number) => {};
}
export default ILanes;