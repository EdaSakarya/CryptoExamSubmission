pragma solidity ^0.4.17;

contract ExamPool {

    address admin;
    mapping (address => address[]) deployedExamsOfUsers;
    mapping (address => bool) profs;
    mapping (address => bool) students;
    enum UserType{Professor, Student}

    // modifirer for restriction to address of Admin
    modifier restrictedToAdmin() {
        require(msg.sender == admin);
        _;
    }

    function createExam(string memory _description, string memory _typeOfWork, uint8 _typeOfSubmission, string memory _subject, uint  _submissionTime, address _student, address _professor) public restrictedToAdmin {
        ExamSubmission newExamAddress = new ExamSubmission(_description, _typeOfWork, _typeOfSubmission, _subject, _submissionTime, _student, _professor);

        address[] storage deployedExamsOfProf = deployedExamsOfUsers[_professor];
        deployedExamsOfProf.push(address(newExamAddress));

        address[] storage deployedExamsOfStudents = deployedExamsOfUsers[_student];
        deployedExamsOfStudents.push(address(newExamAddress));
    }

    function getExamsOfUser(address _user) public view returns(address[] memory) {
        return deployedExamsOfUsers[_user];
    }

    function createUser(int8 _type, address _userAddress) public restrictedToAdmin {
        require(!profs[_userAddress] && !students[_userAddress]);
        if(UserType(_type) == UserType.Professor){
            profs[_userAddress] = true;
        }else if (UserType(_type) == UserType.Student) {
            students[_userAddress] = true;
        }
    }

    function createAdmin() public{
        admin = msg.sender;
    }
}
contract ExamSubmission {

    struct ExamRoom {
        string description;
        string subject;
        string typeOfWork;
        uint8 typeOfSubmission;
        uint submissionTime;
        uint grade;
        string comment;
        address student;
        address prof;
        ExamStatus status;
        mapping (uint => uint) timestamp;
        Data data;
    }

    struct Data {
        string nameOfData;
        // string can be a link or a ipfshash
        string ipfshashORlink;
    }

    ExamRoom exam;
    Data fileData;
    enum ExamStatus { ToSubmit, Submitted, InCorrection, Corrected }
    enum ExamTimestamp { CreatedOn, UploadedOn, InCorrectionOn, GradedOn, CommentedOn }
    enum TypeOfSubmission { Upload, Link }

    // modifier for restriction to address of Professor
    modifier restrictedToProf() {
        require(msg.sender == exam.prof);
        _;
    }

    // modifier for restriction to address of Student
    modifier restrictedToStudent() {
        require(msg.sender == exam.student);
        _;
    }

    function ExamSubmission(string memory _description, string memory _typeOfWork, uint8 _typeOfSubmission, string memory _subject, uint _submissionTime, address _student, address _professor) public {
        createExam(_description, _typeOfWork, _typeOfSubmission, _subject, _submissionTime, _student, _professor);
    }

    // function create a new Exam
    function createExam(string memory _description, string memory _typeOfWork, uint8 _typeOfSubmission, string memory _subject, uint _submissionTime, address _student, address _prof) private {
        ExamRoom storage newExam= exam;

        newExam.description = _description;
        newExam.timestamp[uint(ExamTimestamp.CreatedOn)] = now;
        newExam.subject = _subject;
        newExam.typeOfWork = _typeOfWork;
        newExam.typeOfSubmission = _typeOfSubmission;
        newExam.status = ExamStatus.ToSubmit;
        newExam.prof = _prof;
        newExam.student = _student;
        newExam.submissionTime = _submissionTime;
        newExam.grade = 0;
        newExam.comment = '-';

    }
    function setStatusOfExam(ExamStatus status) private {
        exam.status = status;
    }

    /* get Functions */
    // function returns address of student
    function getStudent() public view returns(address) {
        return exam.student;
    }

    // function returns address of Professor
    function getProf() public view returns(address) {
        return exam.prof;
    }

    // function returns a getSummary of the exam
    function getDetailsOfExam() public view returns(string memory, string memory, string memory,uint, uint, uint, string memory, address, address, ExamStatus){
        return(
        exam.description,
        exam.subject,
        exam.typeOfWork,
        exam.typeOfSubmission,
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
    -> all functions restricted to Student
    */

    // function allows student to upload a File
    // Status of exam changes from 'toSubmit' to 'submitted'
    function submitExam(string memory _name, string memory _input) restrictedToStudent public {
        ExamRoom storage newExam = exam;
        require(newExam.status == ExamStatus.ToSubmit || (newExam.status != ExamStatus.InCorrection && newExam.status != ExamStatus.Corrected));
        Data memory data = Data({
        nameOfData:_name,
        ipfshashORlink: _input
        });
        fileData = data;
        newExam.data = data;

        newExam.timestamp[uint(ExamTimestamp.UploadedOn)] = now;
        setStatusOfExam(ExamStatus.Submitted);
    }
    function getTypeOfSubmit() restrictedToStudent public view returns(uint){
        ExamRoom storage newExam = exam;
        return exam.typeOfSubmission;
    }

    /*
    Prof Functions
    -> all functions restricted to Prof
    */

    // function allows prof to write a comment
    function setComment(string memory _comment) public restrictedToProf {
        require(exam.status != ExamStatus.ToSubmit);
        ExamRoom storage newExam= exam;
        newExam.timestamp[uint(ExamTimestamp.CommentedOn)] = now;
        newExam.comment = _comment;
    }

    // function allows to download the exam file
    function downloadExam() public view returns(string memory) {
        ExamRoom memory newExam = exam;
        require(newExam.status != ExamStatus.ToSubmit);
        Data memory data = newExam.data;
        string memory output= data.ipfshashORlink;
        return output;
    }

    // function allows professor to set a Grade
    // status changes from 'inCorrection' to 'corrected'
    function setGrade(uint _grade) public restrictedToProf {
        require(exam.status == ExamStatus.InCorrection || exam.status == ExamStatus.Corrected);
        ExamRoom storage newExam= exam;
        newExam.timestamp[uint(ExamTimestamp.GradedOn)] = now;
        newExam.grade = _grade;
        setStatusOfExam(ExamStatus.Corrected);
    }

    // function allows professor to set the exam in Correction (in Frontend it should be a button)
    function setStatusInCorrection() public restrictedToProf{
        ExamRoom storage newExam = exam;
        require(newExam.status == ExamStatus.Submitted);
        newExam.status = ExamStatus.InCorrection;
        newExam.timestamp[uint(ExamTimestamp.InCorrectionOn)] = now;
    }
}
