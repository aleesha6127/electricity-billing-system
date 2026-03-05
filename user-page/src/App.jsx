import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLogin />} />
      <Route path="/dashboard" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;
