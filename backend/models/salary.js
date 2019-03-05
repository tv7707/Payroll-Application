const mongoose = require("mongoose");

// Creating a schema to structure the salary data.
const salaryDataSchema = mongoose.Schema({
  employeeId: {type: String, required: true },
  deductionType: {type: String, required: true },
  deductionAmount: {type: Number, required: true }
});


module.exports = mongoose.model("Salary" , salaryDataSchema);
