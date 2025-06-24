import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Authcontext/AuthContext";
import { setTokenCookie } from "../Api/axiosInstance"; // ✅ import this

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setTokenCookie(token); // ✅ Save token from URL to cookie
      fetchUser().then(success => {
        if (success) navigate("/dashboard");
        else navigate("/login");
      });
    } else {
      navigate("/login");
    }
  }, [searchParams, fetchUser, navigate]);

  return <div>Logging you in via Google...</div>;
}
