
const mysql = require('mysql');
const express = require('express');
var app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const {Validation} = require('./validation.js');
const { body, validationResult } = require('express-validator');

//for swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "MYAPP API",
      version: '1.0.0',
    },
  },
  apis: ["index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-users', swaggerUI.serve, swaggerUI.setup(swaggerDocs));



app.use(cors());
app.use(express.json());
 
app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
  extended: true
}));

var mysqlConnection = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6477850',
    password: 'HIi3jFw61D',
    database: 'sql6477850',
    //multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));

app.get('/', (req, res) => {
  res.send('This is the basic api build using nodes.js + express.js framework')
})

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get all the users
 *     responses:
 *       200:
 *         description: Success
 * 
 */

//Get all users
app.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
      console.log(rows)
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});
/**
 * @swagger
 * /users:
 *   post:
 *     description: create new user in the database
 *     parameters:
 *      - Name: title
 *      - Age: 
 *      - Email:
 *      - Gender:
 *      - Mobile_Number:
 *      - Birthday:
 *      - City:
 *      - State:
 *      - Country:
 *      - Address1:
 *      - Address2:
 *        required: true
 *     responses:
 *       201:
 *         description: Created
 */
app.post('/users',Validation,(req, res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var Name = req.body.Name;
  var Age = req.body.Age;
  var Email = req.body.Email;
  var Gender = req.body.Gender;
  var Mobile_Number = req.body.Mobile_Number;
  var Birthday = req.body.Birthday;
  var City = req.body.City;
  var State = req.body.State;
  var Country = req.body.Country;
  var Address1 = req.body.Address1;
  var Address2 = req.body.Address2;
  var userid=req.body.userid;

  var sql = `INSERT INTO users  VALUES ("${Name}", "${Age}", "${Email}", "${Gender}","${Mobile_Number}","${Birthday}","${City}","${State}","${Country}","${Address1}","${Address2}","${userid}")`;
  mysqlConnection.query(sql, function(err, result) {
    if (err) throw err;
     console.log('record inserted');
   // res.redirect('/');
  });
  res.send('inserted successfully');
});
/**
 * @swagger
 * /users/:userid:
 *   delete:
 *     description: delete the user with the given userid
 *     responses:
 *       200:
 *         description: Success
 * 
 */
app.delete('/users/:userid', (req, res) => {
  mysqlConnection.query('DELETE FROM users WHERE userid = ?', [req.params.userid], (err, rows, fields) => {
      //res.send(req.params);
      if (!err)
          res.send('Deleted successfully.');
      else
          console.log(err);
  })
  
});
/**
 * @swagger
 * /users/:userid:
 *   patch:
 *     description: update the user with the given userid
 *     parameters:
 *     responses:
 *       200:
 *         description: Success
 * 
 */

app.patch('/users/:userid', function(req, res) {
  mysqlConnection.query('SELECT userid FROM users WHERE userid = ?',[req.params.userid], function(err, result, field){
    if(result.length === 0){
      res.status(404).json({
        message: 'user not found',
      });
}else{  
  var updateobject = req.body;
  var id=req.params.userid;
  var keys = Object.keys(updateobject);
  keys.forEach((key, index) => {
    mysqlConnection.query(`update users set ${key} = '${updateobject[key]}' where userid = ${id}`,function(err, result){
        if (err) throw err;
        console.log('record inserted');
    });
});
   res.send('updated successfully');
}
});
});

app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});





