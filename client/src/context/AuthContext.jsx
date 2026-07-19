import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if a token already exists (e.g. page refresh).
  // Real "fetch current user" call gets added in Step 5.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Placeholder — Step 5 replaces this with a call to GET /api/auth/me
      setUser({ placeholder: true });
    }
    setLoading(false);
  }, []);

  const login = async (_credentials) => {
    // Implemented in Step 5: call POST /api/auth/login,
    // store the returned JWT, set the user.
    throw new Error("login() not implemented yet — see Step 5");
  };

  const signup = async (_details) => {
    // Implemented in Step 5: call POST /api/auth/signup
    throw new Error("signup() not implemented yet — see Step 5");
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
