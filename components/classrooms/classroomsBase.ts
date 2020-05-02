interface IClassroom {
    getStudentClassrooms: (studentId: string, schoolYear: string, semester: number) => {};
    getStudentList: (classroomId: string) => {};
    joinTimes: () => {};
};

export default IClassroom;