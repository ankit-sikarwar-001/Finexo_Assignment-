const xlsx = require("xlsx");
const DataModel = require("../models/DataModel");

exports.processFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the uploaded file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    let allErrors = [];
    let validData = [];

    // Process each sheet
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      jsonData.forEach((row, index) => {
        let errors = [];

        // Validation Rules
        if (!row.Name) errors.push("Name is required");
        if (!row.Amount || isNaN(row.Amount) || row.Amount <= 0)
          errors.push("Amount must be a number greater than 0");
        if (!row.Date) errors.push("Date is required");

        const date = new Date(row.Date);
        const currentMonth = new Date().getMonth();
        if (date.getMonth() !== currentMonth)
          errors.push("Date must be within the current month");

        if (errors.length > 0) {
          allErrors.push({ sheet: sheetName, row: index + 2, errors });
        } else {
          validData.push({
            sheet: sheetName,
            name: row.Name,
            amount: row.Amount,
            date,
          });
        }
      });
    });

    // Save valid data to MongoDB
    if (validData.length > 0) {
      await DataModel.insertMany(validData);
    }

    res.json({ success: true, errors: allErrors, saved: validData.length });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
