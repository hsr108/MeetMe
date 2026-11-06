import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ROUTES } from "./config/routes.js";
import RequireAuth from "./components/RequireAuth.jsx";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn.jsx";
import MeetingRoute from "./components/MeetingRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AuthenticationPage from "./pages/AuthenticationPage.jsx";
import GuestMeetingPage from "./pages/GuestMeetingPage.jsx";
import JoinMeetingPage from "./pages/JoinMeetingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <>
      {/* One app-wide container so toasts survive page changes (e.g. login → /home). */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path={ROUTES.landing} element={<LandingPage />} />
        <Route
          path={ROUTES.auth}
          element={
            <RedirectIfLoggedIn>
              <AuthenticationPage />
            </RedirectIfLoggedIn>
          }
        />
        <Route path={ROUTES.guest} element={<GuestMeetingPage />} />
        <Route path={ROUTES.join} element={<JoinMeetingPage />} />
        <Route
          path={ROUTES.home}
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.history}
          element={
            <RequireAuth>
              <HistoryPage />
            </RequireAuth>
          }
        />
        {/* Valid meeting codes open a call; any other single segment shows the 404 page. */}
        <Route path={ROUTES.meeting} element={<MeetingRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
