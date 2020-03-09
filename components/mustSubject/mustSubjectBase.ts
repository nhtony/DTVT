interface IMustSubject {
    findAll: () => {};
    findById: (mustSubId: string) => {};
    create: (mustSubId: string, mustSubName: string, subId: string) => {};
    update: (mustSubId: string, mustSubName: string, subId: string) => {};
    delete: (mustSubId: string, subId: string) => {};
}
export default IMustSubject;