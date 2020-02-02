interface ICards {
    findAll: () => {};
    findById: (id: number) => {};
    create: (title: string, label: string, description: string, laneId: number) => {}
    update: (id: number, title: string, label: string, description: string) => {};
    delete: (id: number) => {};
}
export default ICards;