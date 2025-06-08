import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaClipboard } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function TryPage() {
  const [code, setCode] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (e) => setCode(e.target.value);

  const handleGenerateComment = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://codexcomment-v3.onrender.com/tryCodexComment/generateComment",
        { code },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setIsLoading(false);
      if (response.data.msg === "Comment generated successfully") {
        toast.success("Comment generated successfully");
        setComment(response.data.comment);
      } else {
        toast.error(response.data.msg);
        setComment("");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      {/* TopBar */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md">
        <Link to="/" className="text-2xl font-bold text-cyan-400">
          CodexComment
        </Link>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition"
          >
            Signup
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition"
          >
            Signin
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div
        className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/home-bg.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-gray-900/90 p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <h1 className="text-4xl font-extrabold text-center text-cyan-400 mb-6">
            CodexComment - Try It Out
          </h1>

          <div className="space-y-6">
            {/* Code Input */}
            <div className="relative">
              <label htmlFor="code" className="block text-gray-300 text-lg">
                Enter Your Code:
              </label>
              <textarea
                id="code"
                value={code}
                onChange={handleCodeChange}
                className="w-full h-40 px-4 py-3 mt-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Paste your code here..."
                required
              />
              <FaClipboard
                onClick={() => copyToClipboard(code)}
                className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-cyan-500"
                size={20}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateComment}
              className={`w-full py-3 text-lg bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-400 transition ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Comment"}
            </button>

            {/* Output Section */}
            {comment && (
              <div className="relative mt-6 p-4 bg-gray-800 rounded-lg overflow-auto">
                <h2 className="text-2xl font-semibold text-cyan-400 mb-2">
                  Generated Comment
                </h2>
                <pre className="text-sm text-gray-300">{comment}</pre>
                <FaClipboard
                  onClick={() => copyToClipboard(comment)}
                  className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-cyan-500"
                  size={20}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
