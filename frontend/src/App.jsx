import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import SignIn from "./pages/Auth/SignIn"
import SignUp from "./pages/Auth/SignUp"
import SingleQuestion from "./pages/Question/SingleQuestion"
import UserQuestions from "./pages/Question/UserQuestions"
import UserProfile from "./pages/User/UserProfile"


function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/single-question" element={<SingleQuestion />} />
          <Route path="/user-questions" element={<UserQuestions />} />
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
