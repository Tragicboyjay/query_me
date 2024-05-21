import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import UserQuestions from "./pages/Question/UserQuestions";
import UserProfile from "./pages/User/UserProfile";
import UserSettings from "./pages/User/UserSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import Error from "./pages/Error";
import { Flex,Box } from "@chakra-ui/react";

function App() {
  return (
    <Flex direction="column" minHeight="100vh">
      <Navbar />
      <Box 
        flex="1" 
        p={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/user/:username" element={<UserQuestions />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-profile/settings" element={<UserSettings />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </Box>
      <Footer />
    </Flex>
  );
}

export default App;
