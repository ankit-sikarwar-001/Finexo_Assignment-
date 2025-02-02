import  { useState } from "react";
import FileUpload from "./FileUpload";
import DataPreview from "./DataPreview";

const App = () => {
  const [workbook, setWorkbook] = useState(null);

  return (
    <div className="container mx-auto p-4">
      {!workbook ? <FileUpload onFileUpload={setWorkbook} /> : <DataPreview workbook={workbook} />}
    </div>
  );
};

export default App;
