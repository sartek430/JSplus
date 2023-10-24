import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthWrapper from "./hooks/useCheckToken";
import HomePage from "./pages/Accueil";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/SignUp";

const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/MeteoPlus/"
        element={
          <AuthWrapper>
            <HomePage />
          </AuthWrapper>
        }
      />{" "}
      <Route
        path="/MeteoPlus/accueil/:id"
        element={
          <AuthWrapper>
            <HomePage />
          </AuthWrapper>
        }
      />
      {/** HomePage */}
      <Route path="/MeteoPlus/login" element={<Login />} /> {/** Login page */}
      <Route path="/MeteoPlus/signup" element={<Signup />} /> {/** Signup page */}
      <Route path="*" element={<NotFound />} /> {/* Route 404 */}
    </Routes>
  </BrowserRouter>
);

export default Router;
