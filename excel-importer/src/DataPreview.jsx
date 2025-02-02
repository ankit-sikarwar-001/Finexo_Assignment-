import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PropTypes from "prop-types"; //  Import PropTypes

const DataPreview = ({ workbook, savedData }) => {
  // Always call Hooks at the top level
  const [selectedSheet, setSelectedSheet] = useState(
    workbook?.SheetNames?.[0] || ""
  );
  const [data, setData] = useState([]);

  const handleSheetChange = (e) => {
    setSelectedSheet(e.target.value);
    parseSheet(e.target.value);
  };

  const parseSheet = (sheetName) => {
    const sheet = workbook?.Sheets?.[sheetName];
    if (!sheet) {
      setData([]);
      return;
    }
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    setData(jsonData);
  };

  useEffect(() => {
    if (selectedSheet) {
      parseSheet(selectedSheet);
    }
  }, [selectedSheet, workbook]);

  const handleExport = () => {
    if (!savedData || savedData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(savedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Validated Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "validated_data.xlsx");
  };

  return (
    <div className="p-4">
      {/* Move the check inside the return statement */}
      {!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0 ? (
        <p className="text-red-500">No valid workbook uploaded.</p>
      ) : (
        <>
          <select onChange={handleSheetChange} className="p-2 border rounded-md">
            {workbook.SheetNames.map((sheet) => (
              <option key={sheet} value={sheet}>
                {sheet}
              </option>
            ))}
          </select>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((header, idx) => (
                      <th key={idx} className="border p-2 bg-gray-100">
                        {header}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {Object.values(row).map((cell, i) => (
                      <td key={i} className="border p-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleExport}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Export Validated Data
          </button>
        </>
      )}
    </div>
  );
};

//  Add PropTypes validation
DataPreview.propTypes = {
  workbook: PropTypes.object,
  savedData: PropTypes.array,
};

export default DataPreview;
