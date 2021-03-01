// gives a function deshalb sind Klammern am Ende
const routes = require('next-routes')();

routes
    .add('/exams/new', '/exams/new')
    .add('/exams/all', '/exams/allExams/show')
    .add('/exams/:address', '/exams/show')
    .add('/exams/:address/uploads', '/exams/uploads/index')
    .add('/exams/:address/grading', '/exams/grading/index')
    .add('/exams/:address/comment', '/exams/grading/comment');

module.exports= routes;

