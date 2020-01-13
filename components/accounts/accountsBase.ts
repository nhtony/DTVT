interface IAccount {
    findAll:()=>{};
    findById:(id: string)=>{};
    findByIdLecture:(id: string)=>{};
    findByIdStudent:(id: string)=>{};
    createWithIdLecture:(hashPassword: string, role: string, id: string)=>{};
    createWithIdStudent:(hashPassword: string, role: string, id: string)=>{};
    updateStatusById:(id: string, status: string) => {};
};

export default IAccount;