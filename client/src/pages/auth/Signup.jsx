import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SentinelMark from "../../components/ui/SentinelMark";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-950">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-ink-700">
        <div className="flex items-center gap-3">
          <SentinelMark size={36} />
          <span className="font-display font-semibold text-ink-50">Rakshak</span>
        </div>
        <div className="max-w-sm">
          <h1 className="font-display text-3xl text-ink-50 leading-tight mb-3">
            Ask it anything. It already knows your logs.
          </h1>
          <p className="text-ink-400 text-sm leading-relaxed">
            From "what is SQL injection" to "why did this IP get flagged" —
            Rakshak answers in context and drafts the incident report for you.
          </p>
        </div>
        <p className="text-[11px] font-mono text-ink-600">
          rakshak · ai cybersecurity assistant
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <SentinelMark size={32} animated={false} />
            <span className="font-display font-semibold text-ink-50">Rakshak</span>
          </div>

          <h2 className="font-display text-xl text-ink-50 mb-1">Create account</h2>
          <p className="text-sm text-ink-400 mb-6">
            Password must be at least 8 characters.
          </p>

          {error && (
            <div className="mb-4 rounded-md border border-severity-critical/30 bg-severity-critical/10 px-3 py-2 text-sm text-severity-critical">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 mb-1.5">Name</label>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-600 focus:outline-none focus:ring-1 focus:ring-sentinel-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-600 focus:outline-none focus:ring-1 focus:ring-sentinel-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-600 focus:outline-none focus:ring-1 focus:ring-sentinel-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-sentinel-400 px-3 py-2 text-sm font-medium text-ink-950 shadow-glow disabled:opacity-60 transition-opacity"
            >
              {submitting ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="text-sm text-ink-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-sentinel-400 hover:text-sentinel-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
