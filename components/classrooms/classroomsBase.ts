interface IClassroom {
    getStudentClassrooms: (studentId: string, schoolYear: string, semester: number) => {};
    getLectureClassrooms: (lectureId: string, schoolYear: string, semester: number) => {};
    getConsultants: (lectureId: string, schoolYearRange: string) => {};
    joinSubject: (lectureId: string, schoolYear: string, semester: number) => {};
    joinTimes: () => {};
    getStudentList: (classroomId: string) => {};
    getInfoClassroom: (classroomId: string) => {};
    countStudentInClass: (queryByType: string) => {};
    appointClassroomLead: (studentId: string, classroomId: string, status: number) => {};
    getCategory: () => {};
};

export default IClassroom;