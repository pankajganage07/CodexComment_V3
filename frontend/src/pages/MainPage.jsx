import React, { useState } from "react";
import { FaClipboard } from "react-icons/fa"; 
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link,Routes, Route} from "react-router-dom";
import Home from "../components/Home";
import History from "../components/History";
import TopBar from "../components/TopBar";
import UploadFile from "../components/UploadFile";

export default function MainPage() {
  

  return (
    <>
      <TopBar></TopBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="history" element={<History />} />
        <Route path="uploadFile" element={<UploadFile />} />
      </Routes>
      
    </>
  );
}
