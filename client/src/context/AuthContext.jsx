import { createContext, useContext, useState, useEffect } from "react";
import { signupRequest, loginRequest, fetchCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount (e.g. page refresh), if a token already exists, verify it's
  // still valid by asking the API who it belongs to, rather than trusting
  // a token that might be expired or revoked.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        // Token invalid/expired — api.js's response interceptor already
        // cleared it from localStorage on the 401, just reset local state.
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signup = async ({ name, email, password }) => {
    const { user: newUser, token } = await signupRequest({ name, email, password });
    localStorage.setItem("token", token);
    setUser(newUser);
    return newUser;
  };

  const login = async ({ email, password }) => {
    const { user: loggedInUser, token } = await loginRequest({ email, password });
    localStorage.setItem("token", token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components do `const { user } = useAuth()`
// instead of importing useContext + AuthContext everywhere.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
