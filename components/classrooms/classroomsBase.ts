interface IClassroom {
    getStudentClassrooms: (studentId: string, schoolYear: string, semester: number) => {};
    getLectureClassrooms: (lectureId: string, schoolYear: string, semester: number) => {};
    joinSubject: (lectureId: string, schoolYear: string, semester: number) => {};
    joinTimes: () => {};
    getStudentList: (classroomId: string) => {};
    appointLead: (studentId: string, classroomId: string, status: number) => {};
};

export default IClassroom;