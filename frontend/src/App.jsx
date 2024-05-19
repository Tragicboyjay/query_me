import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import SingleQuestion from "./pages/Question/SingleQuestion";
import UserQuestions from "./pages/Question/UserQuestions";
import UserProfile from "./pages/User/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <>
      <Navbar />
      <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/single-question" element={<SingleQuestion />} />
            <Route path="/user-questions" element={<UserQuestions />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/user-profile" element={<UserProfile />} />
            </Route>
          </Routes>
      </>
      <Footer />
    </>
  );
}

export default App;
