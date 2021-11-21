import { useState } from "react";
import axios from "axios";
import "./App.css";
export default function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState({});
  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setRes({});
  };
  const readFileAsBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const handleUpload = async () => {
    const fileInBase64 = await readFileAsBase64(file);
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://azure-func-app1.azurewebsites.net/api/upload?",
        {
          file: fileInBase64,
        }
      );
      setRes(res.data);
      // console.log(res.data);
      alert("success");
    } catch (error) {
      console.log({ error });
      alert("error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="App">
      <div className="box">
        <label htmlFor="file_id"> Select file</label>
        <input
          id="file_id"
          type="file"
          accept="image/*, video/* "
          onChange={handleChange}
        />
        <code>
          {Object.keys(res).map((key) => (
            <p className="output-item">
              <span>{key}:</span>
              <span>{res[key]}</span>
            </p>
          ))}
        </code>
        {file && (
          <button onClick={handleUpload} disabled={isLoading}>
            {isLoading ? "uploading..." : "upload"}
          </button>
        )}
      </div>
    </div>
  );
}
