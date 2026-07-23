import api from "./api";

export async function signupRequest({ name, email, password }) {
  const { data } = await api.post("/auth/signup", { name, email, password });
  return data.data; // { user, token }
}

export async function loginRequest({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data; // { user, token }
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.data.user;
}
