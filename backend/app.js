// Importing express package.
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
var util = require('util');
// Making Database Connection.
mongoose.connect("mongodb+srv://tejal:RhWA18Iy3UU7EOFM@cluster0-vyugq.mongodb.net/payroll?retryWrites=true").
then(() => {
  console.log("Connection Successful!");
})
.catch(() => {
  console.log("Connection Failed");
});

// Mongoose Employee Model
const Employee = require("./models/employee");
// Mongoose Salary Model
const Salary = require("./models/salary");

//Adding headers to responses to enable CORS.
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
  next();
});

// Calling the middleware bodyparser for Json Objects.
app.use(bodyParser.json());

/* Post Request
 * Using body parser to get the data from the response body.
*/
app.post("/employees", (req, res, next) => {
  //Creating an employee object using the model.
  const employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    basePay : req.body.basePay
   });
   employee.save().then(data => {
    res.status(201).json({
      message: "Employee Data added successfully",
      employeeId: data._id
    });
  }).
  catch(error => {
    res.status(500).json({
      message: "Employee Data is not added."
    });
  });
});

/* Get Request to the database.
 * Using find method of model to fetch the employee data
 * Sending the data in form of Json.
 **/
app.get('/employees' ,(req, res, next) => {
Employee.find().then(
  (documents) => {
    res.status(200).json({
      message: 'Employee Data Fed Successfully!',
      employeesData : documents
    });
  }
)
});



/* Post Request
 * Using body parser to get the data from the response body.
*/
app.post("/employee/salary", (req, res, next) => {
  //console.dir(req.body);
  console.log(util.inspect(req.body, {depth: null}));
  //Creating an employee object using the model.
    const employeeSalary = new Salary({
    employeeId: req.body.id,
    deductionType : req.body.type,
    deductionAmount: req.body.amount
   });
   //console.log(employeeSalary);
   employeeSalary.save();
});


/* Get Request to the database.
 * Using find method of model to fetch the salary data
 * Sending the data in form of Json.
 **/
app.get('/employee/salary/:id' , (req, res, next) => {
  param_id = req.params.id.toString();
  Salary.find({employeeId: param_id}).then(
    (documents) => {
      //console.log(documents);
      res.status(200).json({
        message: ' Salary Data Fed Successfully!',
        salaryData : documents
      });
    }
  )
});

// Put request to update the data of the existing employee.
app.put('/employees/:id' , (req, res, next) => {
  const employee = new Employee({
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    basePay : req.body.basePay,
   });
   Employee.updateOne({_id: req.params.id}, employee).then(result => {
    res.status(200).json({
      message: "Employee Updated!"
    });
   });
})

// Deleting employees.
app.delete("/employees/:id", (req, res, next) => {
  //console.log(req.params.id);
  Employee.deleteOne({_id: req.params.id}).then((result) => {
   // console.log(result);
    res.status(200).json({
      message: "Employee Deleted!"
    });
  });
});


// Exporting app to server.js file.
module.exports = app;
