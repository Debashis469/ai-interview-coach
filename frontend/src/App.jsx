import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import InstructionPage from "./pages/InstructionPage.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/instructions" element={<InstructionPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/results" element={< ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
