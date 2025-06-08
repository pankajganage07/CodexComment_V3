import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import TryPage from "./pages/TryPage";
import MainPage from "./pages/MainPage";
import History from "./components/History";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/tryCodexComment" element={<TryPage />}></Route>
          <Route path="/mainPage/*" element={<MainPage />}></Route>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
