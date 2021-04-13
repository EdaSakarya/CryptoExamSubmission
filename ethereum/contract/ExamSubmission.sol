pragma solidity ^0.8.3;

contract ExamPool {

    mapping (address => bool) admin;
    mapping (address => address[]) deployedExamsOfUsers;
    mapping (address => string[]) descriptionOfDeployedExams;
    mapping (address => bool) profs;
    mapping (address => bool) students;
    enum UserType{Professor, Student}

    // modifirer for restriction to address of Admin
    modifier restrictedToAdmin() {
        require(admin[msg.sender]);
        _;
    }
    function createExam(string memory _description, string memory _typeOfWork, uint8 _typeOfSubmission, string memory _subject, uint  _submissionTime, address [] memory _student, address []memory _professor) public restrictedToAdmin {
        require(profs[_professor[0]] && students[_student[0]]);
        ExamSubmission newExamAddress = new ExamSubmission(_description, _typeOfWork, _typeOfSubmission, _subject, _submissionTime, _student, _professor);

        for(uint8 prof = 0; prof < _professor.length; prof++)
        {
            address[] storage deployedExamsOfProf = deployedExamsOfUsers[_professor[prof]];
            deployedExamsOfProf.push(address(newExamAddress));

            string []storage descriptionOfProfs = descriptionOfDeployedExams[_professor[prof]];
            descriptionOfProfs.push(_description);
        }
        for(uint8 student = 0; student < _student.length; student++)
        {
            address[] storage deployedExamsOfStudents = deployedExamsOfUsers[_student[student]];
            deployedExamsOfStudents.push(address(newExamAddress));
            string []storage descriptionOfStudents = descriptionOfDeployedExams[_student[student]];
            descriptionOfStudents.push(_description);
        }
        // descriptionOfDeployedExams[address(newExamAddress)]= _description;
    }

    function getExamsOfUser(address _user) public view returns(address[] memory) {
        return deployedExamsOfUsers[_user];
    }

    function getExamsDescriptionsOfUser(address _user) public view returns(string[] memory) {
        return descriptionOfDeployedExams[_user];
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
        admin[msg.sender] = true;
    }

}
contract ExamSubmission {

    struct ExamDetails {
        string description;
        string subject;
        string typeOfWork;
        uint8 typeOfSubmission;
        uint submissionTime;
        uint grade;
        string comment;
        address[] student;
        address[] prof;
        ExamStatus status;
        mapping (uint => uint) timestamp;
        Data data;
    }

    struct Data {
        string nameOfData;
        // string can be a link or a ipfshash
        string ipfshashORlink;
    }

    ExamDetails exam;
    Data fileData;
    enum ExamStatus { ToSubmit, Submitted, InCorrection, Corrected }
    enum ExamTimestamp { CreatedOn, UploadedOn, InCorrectionOn, GradedOn, CommentedOn }
    enum TypeOfSubmission { Upload, Link }


    // modifier for restriction to address of Professor
    modifier restrictedToProf() {
        require(msg.sender == exam.prof[0] || msg.sender == exam.prof[1]);
        _;
    }

    // modifier for restriction to address of Student
    modifier restrictedToStudent() {
        require(msg.sender == exam.student[0] || msg.sender == exam.student[1]);
        _;
    }

    constructor(string memory _description, string memory _typeOfWork, uint8 _typeOfSubmission, string memory _subject, uint _submissionTime, address[] memory _student, address[] memory _professor) public {
        createExam(_description, _typeOfWork, _typeOfSubmission, _subject, _submissionTime, _student, _professor);
    }

    // function create a new Exam
    function createExam(string memory _description, string memory _typeOfWork, uint8 _typeOfSubmission, string memory _subject, uint _submissionTime, address[] memory _student, address[] memory _prof) private {
        ExamDetails storage newExam= exam;

        newExam.description = _description;
        newExam.timestamp[uint(ExamTimestamp.CreatedOn)] = block.timestamp;
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
    function getStudent() public view returns(address[] memory) {
        return exam.student;
    }

    // function returns address of Professor
    function getProf() public view returns(address[] memory) {
        return exam.prof;
    }

    // function returns a getSummary of the exam
    function getDetailsOfExam() public view returns(string memory, string memory, string memory,uint, uint, uint, string memory, address[] memory, address[] memory, ExamStatus){
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
        ExamDetails storage newExam = exam;
        require(newExam.submissionTime > block.timestamp);
        require(newExam.status == ExamStatus.ToSubmit || (newExam.status != ExamStatus.InCorrection && newExam.status != ExamStatus.Corrected));
        Data memory data = Data({
        nameOfData:_name,
        ipfshashORlink: _input
        });
        fileData = data;
        newExam.data = data;

        newExam.timestamp[uint(ExamTimestamp.UploadedOn)] = block.timestamp;
        setStatusOfExam(ExamStatus.Submitted);
    }
    function getTypeOfSubmit() restrictedToStudent restrictedToProf public view returns(uint){
        ExamDetails storage newExam = exam;
        return newExam.typeOfSubmission;
    }

    /*
    Prof Functions
    -> all functions restricted to Prof
    */

    // function allows prof to write a comment
    function setComment(string memory _comment) private restrictedToProf {
        require(exam.status != ExamStatus.ToSubmit);
        ExamDetails storage newExam= exam;
        newExam.timestamp[uint(ExamTimestamp.CommentedOn)] = block.timestamp;
        newExam.comment = _comment;
    }

    // function allows to download the exam file
    function downloadExam() public view returns(string memory) {
        ExamDetails storage newExam = exam;
        require(newExam.status != ExamStatus.ToSubmit);
        Data memory data = newExam.data;
        return data.ipfshashORlink;
    }

    // function allows professor to set a Grade
    // status changes from 'inCorrection' to 'corrected'
    function setGradeAndComment(uint _grade, string memory _comment ) public restrictedToProf {
        require(exam.status == ExamStatus.InCorrection || exam.status == ExamStatus.Corrected);
        ExamDetails storage newExam= exam;
        newExam.timestamp[uint(ExamTimestamp.GradedOn)] = block.timestamp;
        newExam.grade = _grade;
        newExam.timestamp[uint(ExamTimestamp.CommentedOn)] = block.timestamp;
        newExam.comment = _comment;
        setStatusOfExam(ExamStatus.Corrected);
    }

    // function allows professor to set the exam in Correction (in Frontend it should be a button)
    function setStatusInCorrection() public restrictedToProf{
        ExamDetails storage newExam = exam;
        require(newExam.status == ExamStatus.Submitted);
        newExam.status = ExamStatus.InCorrection;
        newExam.timestamp[uint(ExamTimestamp.InCorrectionOn)] = block.timestamp;
    }
}
