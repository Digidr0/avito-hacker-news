import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import React from "react";
import MainPage from "./pages/main/MainPage.jsx";
import NewsPage from "./pages/news/NewsPage.jsx";
import NotFound from "./pages/notfound/NotFound.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App"></div>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="news/:id" element={<NewsPage />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
