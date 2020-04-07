import accountAPIs from '../components/accounts/accountsAPI';
import lectureAPIs from '../components/lectures/lecturesAPI';
import studentAPIs from '../components/students/studentsAPIs';
import otpAPIs from '../components/otp/otpAPI';
import subjectAPIs from '../components/subjects/subjectsAPI';
import postsAPIs from '../components/posts/postsAPI';
import mustSubjetAPIs from '../components/mustSubject/mustSubjectAPI';
import telecomunicationAPIs from '../components/telecomunication/telecomunicationAPI';
import electricityAPIs from '../components/electricity/electricityAPI';
import electronicAPIs from '../components/electronic/electronicAPI';

export default [
    ...accountAPIs, 
    ...studentAPIs, 
    ...lectureAPIs, 
    ...otpAPIs, 
    ...subjectAPIs, 
    ...electronicAPIs,
    ...mustSubjetAPIs,
    ...postsAPIs,
    ...electricityAPIs,
    ...electricityAPIs,
   ...telecomunicationAPIs
];

