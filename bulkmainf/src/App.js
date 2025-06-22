import axios from "axios";
import * as XLSX from "xlsx";

import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [emails, setEmails] = useState([]);

  function handlemessage(event) {
    setMessage(event.target.value);
  }

  function send() {
    setStatus(true);
    axios.post("https://bulkmail-1-3zk6.onrender.com/send", { message: message, idlist: emails })
      .then(function (data) {
        console.log(data);
        if (data.data) {
          alert("Email sent successfully");
          setStatus(false);
        } else {
          alert("Error sending email");
        }
      })
      .catch((err) => {
        console.error("Send Error:", err);
        alert("Error sending email");
        setStatus(false);
      });
  }

  function handlefile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const emails = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const elist = emails.map(function (item) { return item.A });
      setEmails(elist);
      console.log("Emails:", elist);
    };

    reader.readAsBinaryString(file); // ✅ Correct call moved inside the function
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-xl space-y-6 shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-cyan-400 drop-shadow-lg tracking-wide">
          💡 BulkMail
        </h1>

        <div className="space-y-2">
          <label className="block text-sm text-cyan-200 font-semibold">
            Message
          </label>
          <textarea
            placeholder="Write your message..."
            onChange={handlemessage}
            value={message}
            className="w-full h-32 p-4 rounded-lg bg-gray-800/70 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-cyan-200 font-semibold">
            Upload CSV
          </label>
          <input
            type="file"
            onChange={handlefile}
            accept=".csv"
            className="w-full p-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>

        <div className="text-sm text-cyan-300 text-right">
          📧 Total Emails: <span className="font-semibold text-white">{emails.length}</span>
        </div>

        <button
          onClick={send}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 transition rounded-xl font-semibold text-gray-900 shadow-lg"
        >
          {status ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
