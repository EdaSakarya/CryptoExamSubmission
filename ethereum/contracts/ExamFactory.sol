pragma solidity ^0.4.17;

// contract ExamFactory {

//         address[] public deployedExams;

//     function createExam(string description, string typeOfWork, string subject, uint submissionTime, address student) public {
//         address newExamAddress = new ExamDetails(description, typeOfWork, subject, submissionTime, msg.sender, student);

//       deployedExams.push(newExamAddress);
//     }
// }

contract ExamDetails {
    struct ExamRoom {
        string description;
        string subject;
        string typeOfWork;
        uint submissionTime;
        uint grade;
        string comment;
        address student;
        address prof;
        ExamStatus status;
        mapping (uint => uint) timestamp;
        File file;
    }

    struct File {
        bytes32 filename;
        string ipfshash;
    }

    ExamRoom public exam;
    enum ExamStatus { toSubmit, submitted, inCorrection, corrected }
    enum ExamTimestamp { createdOn, uploadedOn, downloadedOn, gradedOn, commentedOn }

    // modifirer for restriction to address of Prodessor
    modifier restrictedToProf() {
        require(msg.sender == exam.prof);
        _;
    }

    // modifirer for restriction to address of Student
    modifier restrictedToStudent() {
        require(msg.sender == exam.student);
        _;
    }

    constructor(string _description, string _typeOfWork, string _subject, uint _submissionTime, address _student) public {
        createExam(_description, _typeOfWork, _subject, _submissionTime, _student, msg.sender);
    }

    // function create a new Exam
    function createExam(string _description, string _typeOfWork, string _subject, uint _submissionTime, address _student, address _prof) private {
        ExamRoom storage newExam= exam;

        newExam.description = _description;
        newExam.timestamp[uint(ExamTimestamp.createdOn)] = now;
        newExam.subject = _subject;
        newExam.typeOfWork = _typeOfWork;
        newExam.status = ExamStatus.toSubmit;
        newExam.prof = _prof;
        newExam.student = _student;
        newExam.submissionTime = _submissionTime;
        newExam.grade = 0;
        newExam.comment = '-';

    }
    function setStatusOfExam(ExamStatus status) private {
        exam.status = status;
    }

    /*get Functions */
    // function returns address of student
    function getStudent() public view returns(address) {
        return exam.student;
    }

    // function returns address of Professor
    function getProf() public view returns(address) {
        return exam.prof;
    }

    // function returns a getSummary of the exam
    function getDetailsOfExam() public view returns(string, string, string, uint, uint, string, address, address, ExamStatus){
        return(
        exam.description,
        exam.subject,
        exam.typeOfWork,
        exam.submissionTime,
        exam.grade,
        exam.comment,
        exam.student,
        exam.prof,
        exam.status
        );
    }

    // function returns all timestamps
    function getTimestampOfExamProcess() public view returns (uint, uint, uint, uint){
        return(
        exam.timestamp[0],
        exam.timestamp[1],
        exam.timestamp[2],
        exam.timestamp[3]
        );
    }

    /*
    Student Functions
    -> all funtions restricted to Student
    */

    // function allows student to upload a File
    // Status of exam changes from 'abzugeben' to 'abgegeben'
    function uploadFile(bytes32 _name, string _ipfshash) public {
        ExamRoom storage newExam= exam;
        require(newExam.status == ExamStatus.toSubmit);

        File memory file = File({
        filename:_name,
        ipfshash: _ipfshash
        });
        newExam.file = file;

        newExam.timestamp[uint(ExamTimestamp.uploadedOn)] = now;
        setStatusOfExam(ExamStatus.submitted);
    }

    /*
    Prof Functions
    -> all funtions restricted to Prof
    */

    // function allows prof to write a comment
    function setComment(string _comment) public restrictedToProf {
        require(exam.status != ExamStatus.toSubmit);
        ExamRoom storage newExam= exam;
        newExam.timestamp[uint(ExamTimestamp.commentedOn)] = now;
        newExam.comment = _comment;
    }

    // funtion allows to download the exam file
    // Status changes from 'abgegeben' to 'inKorrektur'
    function downloadFile() public restrictedToProf {
        require(exam.status != ExamStatus.toSubmit);
        ExamRoom storage newExam= exam;
        newExam.timestamp[uint(ExamTimestamp.downloadedOn)] = now;
        setStatusOfExam(ExamStatus.inCorrection);
    }

    // function allwos professor to set a Grade
    // status changes from 'inKorrektur' to 'korrigiert'
    function setGrade(uint _grade) public restrictedToProf {
        require(exam.status == ExamStatus.inCorrection);
        ExamRoom storage newExam= exam;
        newExam.timestamp[uint(ExamTimestamp.gradedOn)] = now;
        newExam.grade = _grade;
        setStatusOfExam(ExamStatus.corrected);
    }

}
