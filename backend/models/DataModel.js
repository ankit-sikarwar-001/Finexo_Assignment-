const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  sheet: String,
  name: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Data", DataSchema);
