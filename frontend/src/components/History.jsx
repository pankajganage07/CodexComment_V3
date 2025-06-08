import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaClipboard } from "react-icons/fa";
import toast from "react-hot-toast";

export default function History() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [history, setHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetching history
  const getHistory = async () => {
    try {
      const response = await axios.get("https://codexcomment-v3.onrender.com/user/history", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    getHistory();
  }, [token]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Sorting using timestamps
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
    
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <>
      {/* ✅ Fixed Background (Doesn't Overlap Content) */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/home-bg.jpg')", zIndex: -1 }}></div>

      

      {/* ✅ Main Content (Ensures It Stays Above Background) */}
      <div className="relative z-10 min-h-screen flex flex-col items-center p-6">
        <div className="w-full max-w-5xl bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl shadow-lg text-white">
          {/* Sorting Dropdown */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-cyan-400">History</h2>
            <div>
              <label htmlFor="sortDropdown" className="text-lg font-semibold mr-2">
                Sort By:
              </label>
              <select
                id="sortDropdown"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="asc">Oldest First</option>
                <option value="desc">Newest First</option>
              </select>
            </div>
          </div>

          {/* History Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sortedHistory.length > 0 ? (
              sortedHistory.map((hist) => (
                <div
                  key={hist._id}
                  className="p-6 bg-gray-800/80 backdrop-blur-md text-white rounded-lg shadow-md relative"
                >
                  <div className="absolute top-4 right-4">
                    <FaClipboard
                      onClick={() => copyToClipboard(hist.codeComment)}
                      className="text-gray-400 cursor-pointer hover:text-cyan-500"
                      size={20}
                    />
                  </div>

                  <pre className="whitespace-pre-wrap break-words text-sm">
                    <code>{hist.codeComment}</code>
                  </pre>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-2">No history found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
