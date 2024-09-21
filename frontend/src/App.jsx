import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { axiosInstance } from "./lib/axios";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostsPage from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong");
      }
    }
  });

  if (isLoading) return null;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/notifications" element= { authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
        <Route path="/network" element= { authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
        <Route path="/post/:postId" element= { authUser ? <PostsPage /> : <Navigate to={"/login"} />} />
        <Route path="/profile/:username" element= { authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
      </Routes>
      <Toaster />
    </Layout>
  );
};

export default App