// gives a function deshalb sind Klammern am Ende
const routes = require('next-routes')();

routes
    .add('/exams/new', '/exams/new')
    .add('/exams/:address', '/exams/show')
    .add('/exams/:address/uploads', '/exams/uploads/index');

module.exports= routes;

