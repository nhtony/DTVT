import accountAPIs from '../components/accounts/accountsAPI';
import lectureAPIs from '../components/lectures/lecturesAPI';
import studentAPIs from '../components/students/studentsAPIs';
import otpAPIs from '../components/otp/otpAPI';
import subjectAPIs from '../components/subjects/subjectsAPI';
import cardsAPIs from '../components/cards/cardsAPI';
import lanesAPIs from '../components/lanes/lanesAPI';
import electronicAPIs from '../components/electronic/electronicAPI';

export default [...accountAPIs, ...lectureAPIs, ...otpAPIs, ...studentAPIs, ...subjectAPIs, ...cardsAPIs, ...lanesAPIs,...electronicAPIs];