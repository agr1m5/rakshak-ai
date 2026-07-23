import { registerUser, loginUser } from "../services/authService.js";

// Shared shape so the frontend gets identical user objects from
// signup, login, and /me — never includes passwordHash.
function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function signup(req, res) {
  const { name, email, password } = req.body;
  const { user, token } = await registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    data: { user: toPublicUser(user), token },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const { user, token } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    data: { user: toPublicUser(user), token },
  });
}

export async function me(req, res) {
  // req.user is populated by the `protect` middleware
  res.status(200).json({
    success: true,
    data: { user: toPublicUser(req.user) },
  });
}
