interface IClassroom {
    getStudentClassrooms: (studentId: string) => {};
    getStudentList: (classroomId: string) => {};
    joinTimes: () => {};
};

export default IClassroom;