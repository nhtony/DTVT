interface ICards {
    findAll: () => {};
    create: (id:string,title: string, label: string, description: string, laneId: number) => {}
    update: (id: string, laneId:number) => {};
    delete: (id: string) => {};
}
export default ICards;