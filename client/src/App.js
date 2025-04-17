import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "./pages/MainPage";
import AdminRegistrationPage from "./pages/AdminRegistrationPage";
import PlayerRegistrationPage from "./pages/PlayerRegistrationPage";
import LoginPage from "./pages/LoginPage";
import AdminMainPage from "./pages/AdminMainPage";
import PlayerMainPage from "./pages/PlayerMainPage";
import ResultsPage from "./pages/ResultsPage";
import LivePage from "./pages/LivePage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/adminRegistration" element={<AdminRegistrationPage/>}/>
          <Route path="/playerRegistration" element={<PlayerRegistrationPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/adminMain" element={<AdminMainPage/>}/>
          <Route path="/playerMain" element={<PlayerMainPage/>}/>
            <Route path="/results" element={<ResultsPage/>}/>
          <Route path="/live" element={<LivePage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
