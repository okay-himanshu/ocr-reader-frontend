import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [amazonFields, setAmazonFields] = useState([]);
  const [base64Fields, setBase64Fields] = useState([]);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const uploadAndProcessImage = async () => {
    if (!image) {
      console.error("No image selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("providers", "amazon,base64");
    formData.append("fallback_providers", "");

    // https://www.edenai.co/
    const apiKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2QwMTcyNWEtZjRiYi00MzI4LThlZDItZTI2OWI1OTE5NzFkIiwidHlwZSI6ImFwaV90b2tlbiJ9.Lz4B4787FmUQ3XDY7EI4BjemDuEjOuV3YYlQORlNmj4";

    const options = {
      method: "POST",
      url: "https://api.edenai.run/v2/ocr/data_extraction",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      const response = await axios.request(options);
      console.log("OCR Data:", response.data);
      console.log(response.data);
      setOcrData(response.data);
      setAmazonFields(response.data.amazon.fields);
      setBase64Fields(response.data.base64.fields);
    } catch (error) {
      console.error("Error processing image:", error.response.data);
    }
  };

console.log(56)

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold bg-black text-white py-4 text-center">
        OCR Reader
      </h1>

      <form className="flex justify-center items-center flex-col mt-5 m-10 py-6">
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={uploadAndProcessImage}
          className="bg-black text-white py-2 px-4 rounded-md mt-10"
        >
          Upload & Process Image
        </button>
      </form>

      {ocrData && (
        <div>
          <h2 className="my-10">Extracted Cheque Data</h2>

          {base64Fields.length > 0 && (
            <div>
              <table className="border-2 border-gray-700">
                <thead>
                  <tr className="border-2 p-2">
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody className="border-2">
                  {base64Fields.map((field, index) => (
                    <tr key={index} className="border-2 ">
                      <td className="border-2 p-2">{field.key}</td>
                      <td className="border-2 p-2">{field.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {amazonFields.length > 0 && (
            <div>
              <table className="border-2 border-gray-700">
                <thead>
                  <tr className="border-2 p-2">
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody className="border-2">
                  {amazonFields.map((field, index) => (
                    <tr key={index} className="border-2 ">
                      <td className="border-2 p-2">NAME</td>
                      <td className="border-2 p-2">{field.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
