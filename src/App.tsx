import React, { ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import { ScoreProvider } from "./contexts/ScoreContext";
import InvitationHandler from './components/InvitationHandler';
import Invite from './pages/Invite';

const App = () => {
  return (
    <AuthProvider>
      <ScoreProvider>
        <Router>
          <Header />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/invite" element={<Invite />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/invite/:invitationId" element={<InvitationHandler />} />
            </Routes>
          </div>
        </Router>
      </ScoreProvider>
    </AuthProvider>
  );
};

export default App;

