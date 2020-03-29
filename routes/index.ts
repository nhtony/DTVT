import accountAPIs from '../components/accounts/accountsAPI';
import lectureAPIs from '../components/lectures/lecturesAPI';
import studentAPIs from '../components/students/studentsAPIs';
import otpAPIs from '../components/otp/otpAPI';
import subjectAPIs from '../components/subjects/subjectsAPI';
import electronicAPIs from '../components/electronic/electronicAPI';
import mustSubjetAPIs from '../components/mustSubject/mustSubjectAPI';

export default [
    ...accountAPIs, 
    ...lectureAPIs, 
    ...otpAPIs, 
    ...studentAPIs, 
    ...subjectAPIs, 
    ...electronicAPIs,
    ...mustSubjetAPIs
];