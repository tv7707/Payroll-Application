const mongoose = require("mongoose");

// Creating a schema to structure the employee data.
const empDataSchema = mongoose.Schema({
  name: {type: String, required: true },
  email: {type: String, require: true},
  basePay: {type: String, required: true }
});


module.exports = mongoose.model("Employee" , empDataSchema)
