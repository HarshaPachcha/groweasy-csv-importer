"use client";

import { useState, DragEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {

  //-----------------------
  // States
  //-----------------------

  const [file, setFile] = useState<File | null>(null);

  const [uploadedFile, setUploadedFile] = useState("");

  const [preview, setPreview] = useState<any[]>([]);

  const [mapping, setMapping] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);

  const [dragging, setDragging] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [importSuccess, setImportSuccess] = useState(false);
  
  const [importResult, setImportResult] = useState<any>(null);

  const [importProgress, setImportProgress] = useState(0);

  //-----------------------
  // File Validation
  //-----------------------

const handleFile = (selectedFile: File) => {

  if (!selectedFile.name.endsWith(".csv")) {
    toast.error("Only CSV files are allowed.");
    return;
  }

  setFile(selectedFile);
};

  //-----------------------
  // Drag & Drop
  //-----------------------

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {

    e.preventDefault();

    setDragging(false);

    if (e.dataTransfer.files.length > 0) {

      handleFile(e.dataTransfer.files[0]);

    }

  };

  //-----------------------
  // Upload CSV
  //-----------------------

  const uploadCSV = async () => {

    if (!file) {

      toast.error("Please choose a CSV file.");

      return;

    }

    setLoading(true);

    setUploadProgress(0);

    toast.error("");

    toast.success("");

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await axios.post(

        "http://localhost:5000/upload",

        formData,

        {

          headers: {

            "Content-Type": "multipart/form-data",

          },

          onUploadProgress(progressEvent) {

            if (progressEvent.total) {

              const percent = Math.round(

                (progressEvent.loaded * 100) /

                  progressEvent.total

              );

              setUploadProgress(percent);

            }

          },

        }

      );

      setPreview(response.data.preview);

      setMapping({

        ...response.data.aiMapping,

      });

      setUploadedFile(response.data.file);

      toast.success("CSV Uploaded Successfully!");

    }

    catch (err: any) {

      if (err.response) {

        toast.error(err.response.data.message);

      }

      else {

        toast.error("Backend Not Running");

      }

    }

    finally {

      setLoading(false);

    }

  };

  //-----------------------
  // Reset
  //-----------------------

  const resetAll = () => {

    setFile(null);

    setUploadedFile("");

    setPreview([]);

    setMapping({});

    toast.success("");

    toast.error("");

    setUploadProgress(0);

    setImportProgress(0);

    setImportSuccess(false);

    setImportResult(null);
  
  };

  //-----------------------
  // Import
  //-----------------------

  const importData = async () => {

    

    if (!uploadedFile) {

        toast.error("Please upload a CSV first.");

        return;

    }

    try {

        setLoading(true);

        setImportProgress(20);

        const response = await axios.post(
            "http://localhost:5000/import",
            {
                filePath: `uploads/${uploadedFile}`,
                mapping: mapping
            }
        );

        setImportResult(response.data);

        setImportProgress(80);
        
        setImportSuccess(true);
        toast.success(
          `${response.data.importedRows} records imported successfully!`
        );

        setImportProgress(100);

    } catch (error: any) {

        

        if (error.response) {
            toast.error(error.response.data.message || "Import Failed");
        } else {
            toast.error("Cannot connect to backend.");
        }

    } finally {

        setLoading(false);
         setTimeout(() => {
          setImportProgress(0);
        }, 2000);

    }

};
// ====================================
// Download JSON
// ====================================

const downloadJSON = () => {

    if (!importResult?.data) return;

    const blob = new Blob(
        [JSON.stringify(importResult.data, null, 2)],
        {
            type: "application/json",
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "crm-import.json";

    a.click();

    URL.revokeObjectURL(url);

};

const downloadCSV = () => {

    if (!importResult?.data?.length) return;

    const headers = Object.keys(importResult.data[0]);

    const csvRows = [

        headers.join(","),

        ...importResult.data.map((row: any) =>

            headers.map((header) => {

                const value = row[header] ?? "";

                return `"${String(value).replace(/"/g, '""')}"`;

            }).join(",")

        )

    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob(

        [csvContent],

        {

            type: "text/csv;charset=utf-8;"

        }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "crm-import.csv";

    link.click();

    URL.revokeObjectURL(url);

};

// ===============================
// Visible Columns
// ===============================

const visibleColumns =
  importResult?.data?.length
    ? Object.keys(importResult.data[0]).filter((key) =>
        importResult.data.some(
          (row: any) =>
            row[key] !== null &&
            row[key] !== "" &&
            row[key] !== undefined
        )
      )
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-500">

  <div className="max-w-7xl mx-auto px-8 py-12">

    {/* Header */}

    <div className="sticky top-0 z-50 bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-500 py-6 text-center">

      <h1 className="text-6xl font-extrabold text-white">

        🚀 GrowEasy CSV Importer

      </h1>

      <p className="mt-4 text-blue-100 text-xl">

        AI Powered CRM Data Import

      </p>

    </div>

    {/* Upload Card */}

    <div className="mt-12 bg-white rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] hover:-translate-y-1">

      <h2 className="text-3xl font-bold text-gray-800">

        Upload CSV

      </h2>

      <p className="text-gray-500 mt-2">

        Drag & Drop your CSV or browse.

      </p>

      {/* Drag Area */}

      <div

        onDrop={handleDrop}

        onDragOver={(e) => {

          e.preventDefault();

          setDragging(true);

        }}

        onDragLeave={() => setDragging(false)}

        className={`

          mt-8

          border-4

          border-dashed

          rounded-3xl

          p-16

          text-center

          transition

          cursor-pointer

          ${dragging

            ? "border-blue-600 bg-blue-50"

            : "border-gray-400 bg-gray-50"}

        `}

      >

        <div className="text-6xl">

          📄

        </div>

        <h3 className="text-2xl font-bold text-gray-700 mt-4">

          Drag & Drop CSV Here

        </h3>

        <p className="text-gray-500 mt-3">

          or

        </p>

        <label className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl cursor-pointer font-semibold">

          Choose CSV

          <input

            hidden

            type="file"

            accept=".csv"

            onChange={(e) => {

              if (e.target.files) {

                handleFile(e.target.files[0]);

              }

            }}

          />

        </label>

      </div>

      {/* File Info */}

      {file && (

        <div className="mt-8 bg-blue-100 border border-blue-300 rounded-2xl p-6 shadow-md">

          <h3 className="font-bold text-blue-700 text-xl">

            Selected File

          </h3>

          <div className="mt-3 space-y-3">

            <p className="text-gray-900 font-semibold text-lg">

              📄 {file.name}
              
            </p>

            <p className="text-gray-700 font-medium">

              📦 {(file.size / 1024).toFixed(2)} KB
              
            </p>

          </div>

        </div>

      )}

      {/* Upload Button */}

      <button

        onClick={() => uploadCSV()}

        disabled={loading}

        className="mt-8 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl text-xl font-bold hover:scale-105 transition"

      >

        {loading ? "⏳ Uploading CSV..." : "📤 Upload CSV"}

      </button>

      {/* Progress */}

      {loading && (

        <div className="mt-6">

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div

              className="bg-blue-600 h-4 rounded-full transition-all"

              style={{

                width: `${uploadProgress}%`,

              }}

            />

          </div>

          <p className="text-center mt-2">

            {uploadProgress}%

          </p>

        </div>

      )}

      

    </div>
    {/* CSV Preview */}

{preview.length > 0 && (

  <div className="mt-12 bg-white rounded-3xl shadow-2xl p-10">

    <div className="flex justify-between items-center mb-8">

      <h2 className="text-3xl font-bold text-gray-800">
        📄 CSV Preview
      </h2>

      <span className="bg-blue-600 text-white px-5 py-2 rounded-full">
        {preview.length} Rows
      </span>

    </div>

    <div className="overflow-x-auto rounded-2xl border border-gray-300 shadow">

      <table className="min-w-full border-collapse">

        <thead>

          <tr className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 z-10">

            {Object.keys(preview[0]).map((key) => (

              <th
                key={key}
                className="px-6 py-4 text-left text-white font-bold whitespace-nowrap"
              >
                {key || "Column"}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {preview.map((row, index) => (

            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >

              {Object.values(row).map((value: any, i) => (

                <td
                  key={i}
                  className="px-6 py-4 border-b border-gray-200 text-gray-800 whitespace-nowrap"
                >
                  {String(value)}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    <div className="mt-5 flex justify-between">

      <p className="text-gray-500">
        Showing first {preview.length} rows
      </p>

      <span className="bg-indigo-600 text-white px-4 py-2 rounded-full">
        Preview Only
      </span>

    </div>

  </div>

)}

{/* AI Mapping */}

{Object.keys(mapping).length > 0 && (

  <div className="mt-12 bg-white rounded-3xl shadow-2xl p-10">

    <div className="flex justify-between items-center mb-8">

      <div>

        <h2 className="text-3xl font-bold text-gray-800">
          🤖 AI Field Mapping
        </h2>

        <p className="text-gray-500 mt-2">
          AI suggested these mappings. You can edit them before importing.
        </p>

      </div>

      <span className="bg-green-600 text-white px-5 py-2 rounded-full">
        Editable
      </span>

    </div>

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {Object.entries(mapping).map(([crmField, selectedColumn]) => (

        <div
          key={crmField}
          className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg p-6"
        >

          <label className="block font-bold text-blue-700 mb-3">
            {crmField}
          </label>

          <select
            value={selectedColumn || ""}
            onChange={(e) =>
              setMapping((prev) => ({
                ...prev,
                [crmField]: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 font-medium"
          >

            <option value="">Not Mapped</option>

            {preview.length > 0 &&
              Object.keys(preview[0]).map((column) => (

                <option key={column} value={column}>
                  {column || "(Blank Column)"}
                </option>

              ))}

          </select>

        </div>

      ))}

    </div>

    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">

      <h3 className="font-bold text-blue-700">
        ℹ️ AI Mapping Information
      </h3>

      <p className="text-gray-700 mt-2">
        Review the mapping before importing.
      </p>

    </div>

  </div>

)}

{/* Action Buttons */}

<div className="mt-12 flex flex-col md:flex-row gap-6">

  <button
    onClick={importData}
    disabled={loading}
    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-4 rounded-2xl text-xl font-bold shadow-lg transition transform hover:scale-105"
  >
    {loading ? "⏳ Importing..." : "📥 Import Data"}
  </button>

  <button
    onClick={resetAll}
    disabled={loading}
    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 rounded-2xl text-xl font-bold shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    🔄 Reset
  </button>

</div>

{/* ================= IMPORT PROGRESS ================= */}

{loading && (

  <div className="mt-8">

    <div className="flex justify-between mb-2">

      <span className="text-white font-semibold">
        Import Progress
      </span>

      <span className="text-white font-semibold">
        {importProgress}%
      </span>

    </div>

    <div className="w-full bg-white/20 rounded-full h-5 overflow-hidden">

      <div
        className="bg-green-500 h-5 rounded-full transition-all duration-500"
        style={{ width: `${importProgress}%` }}
      />

    </div>

  </div>

)}

{/* ================= SUCCESS DASHBOARD ================= */}

{importSuccess && importResult && (

  <div className="mt-12 bg-white rounded-3xl shadow-2xl p-10">

    <div className="text-center">

      <h2 className="text-5xl font-bold text-green-600">

        🎉 Import Successful

      </h2>

      <p className="mt-3 text-gray-500 text-lg">

        Your CSV has been imported successfully.

      </p>

    </div>

    {/* Statistics */}

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

      <div className="bg-green-50 rounded-2xl p-6 text-center shadow">

        <h3 className="text-gray-500">

          📄 Records Imported

        </h3>

        <p className="text-4xl font-bold text-green-600 mt-3">

          {importResult.importedRows}

        </p>

      </div>

      <div className="bg-blue-50 rounded-2xl p-6 text-center shadow">

        <h3 className="text-gray-500">

          🤖 AI Fields Mapped

        </h3>

        <p className="text-4xl font-bold text-blue-600 mt-3">

          {Object.values(mapping).filter(Boolean).length}

        </p>

      </div>

      <div className="bg-yellow-50 rounded-2xl p-6 text-center shadow">

        <h3 className="text-gray-500">

          ⚡ Status

        </h3>

        <p className="text-2xl font-bold text-yellow-600 mt-3">

          Completed

        </p>

      </div>

      <div className="bg-purple-50 rounded-2xl p-6 text-center shadow">

        <h3 className="text-gray-500">

          🕒 Imported At

        </h3>

        <p className="text-lg font-bold text-purple-600 mt-3">

          {new Date().toLocaleString()}

        </p>

      </div>

    </div>

    {/* Download Buttons */}
    <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
      <button
      onClick={downloadJSON}
      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg transition transform hover:scale-105"
      >
        ⬇ Download JSON
      </button>
      <button
        onClick={downloadCSV}
        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📄 Download CSV
      </button>
      <button
      onClick={resetAll}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg transition transform hover:scale-105"
      >
        🔄 Import Another CSV
      </button>
    </div>

    {/* Imported Data */}

    <div className="mt-12">

      <h2 className="text-3xl font-bold text-gray-800 mb-6">

        📋 Imported Data Preview

      </h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-300">

        <table className="min-w-full">

          <thead>

            <tr className="bg-gradient-to-r from-blue-600 to-cyan-500">
              {visibleColumns.map((key) => (
                <th
                key={key}
                className="px-5 py-4 text-left text-white"
              >
                {key}
              </th>
            ))}

            </tr>

          </thead>

          <tbody>

            {importResult.data.slice(0, 10).map((row: any, index: number) => (

              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
              >
                {visibleColumns.map((key) => (
                <td
                  key={key}
                  className="px-5 py-4 border-b text-gray-900 font-semibold"
                >
                  {String(row[key] ?? "")}
                </td>


              ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  </div>

)}

{/* Footer */}

<div className="mt-20 text-center">

  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">

    <h2 className="text-3xl font-bold text-white">

      🚀 GrowEasy AI CSV Importer

    </h2>

    <p className="text-blue-100 mt-3">

      AI-Powered CRM CSV Importer built using Next.js, Express.js, Gemini AI and Tailwind CSS.

    </p>

    <div className="mt-6 flex justify-center gap-4 flex-wrap">

      <span className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold">

        Next.js

      </span>

      <span className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold">

        Express.js

      </span>

      <span className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold">

        Gemini AI

      </span>

      <span className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold">

        Tailwind CSS

      </span>

    </div>

    <p className="text-blue-200 mt-8 text-sm">

      © 2026 GrowEasy AI CSV Importer • Developed by Pachcha Harshavardhan

    </p>

  </div>

</div>

</div>

</main>

);

}