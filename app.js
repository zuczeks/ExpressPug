var express = require('express');
var path = require('path');
var mysql = require('mysql');
var myConnection  = require('express-myconnection');
 var app = express();
 
app.use(express.urlencoded({ extended: true }));
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
 
var dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db1',
    port: 3306
}
app.use(myConnection(mysql, dbOptions, 'pool'));

app.get('/', function(req, res){
     res.render('start',{
        title: 'Jakis tytul',
    });
});

app.get('/list', function(req, res){
    req.getConnection(function(error, conn){
        conn.query('SELECT * FROM students', function(err, rows){
            var studentsList=rows;
			
             res.statusCode = 200;
             res.setHeader('Content-Type', 'text/json');
             res.end(JSON.parse(studentsList));
			 
             //res.render('list',{
             //    studentsList: studentsList
             //});
        });
    });
    // var studentsList=[
    //     {name: 'Ada', docnr: 111},
    //     {name: 'Olaf', docnr: 222},
    //     {name: 'Igi', docnr: 333},
    // ]
});
 
app.get('/add', function(req, res){
     res.render('add');
});
 
app.post('/add', function(req, res){
    var student={
        name: req.body.name,
        docnr:parseInt(req.body.docnr)
    }
    req.getConnection(function(error, conn){
        conn.query('INSERT INTO students SET ?', student, function(err, rows){
            
			if(err){
                var message='Blad'
            }
			else{
                var message='Dodano studenta'
            }
 
             res.render('add',{
                 message:message
             });
         });
    });
});

app.get('/edit/(:id)', function(req, res){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * from students WHERE id = '+req.params.id, function(err, rows){
            res.render('edit', {
                id: rows[0].id,
                name: rows[0].name,
                docnr: parseInt(rows[0].docnr)
            });
        });
    });
});

app.post('/edit/(:id)', function(req, res){
    var student={
        name: req.body.name,
        docnr:parseInt(req.body.docnr)
    }
    req.getConnection(function(error, conn) {
        conn.query('UPDATE students SET ? WHERE id = '+req.params.id, student, function(err, rows){
            if(err){
                var message='Blad'
            }else{
                var message='Poprawna edycja danych'
            }
            res.render('edit', {
                id: req.params.id,
                name: req.body.name,
                docnr:parseInt(req.body.docnr),
                message:message
            });
        });
    });
});


app.get('/delete/(:id)', function(req, res){
        res.render('delete', {
            id: req.params.id
        });
});
app.post('/delete/(:id)', function(req, res){
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM students WHERE id = '+req.params.id, function(err, rows){
            if(err){
                var message='Blad'
            }else{
                var message='Usunieto studenta'
            }
            res.render('delete', {
                id: req.params.id,
                message:message
            });
        });
    });
});
 

app.post('/', function(req, res){
    console.log(req.body);
    var c=parseInt(req.body.d) + parseInt(req.body.e)
      res.send('d+e: ' + c);
});
 

app.listen(3000);