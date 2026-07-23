import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SentinelMark from "../../components/ui/SentinelMark";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Branding panel — the sentinel mark is the hero here */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-ink-700 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <SentinelMark size={36} />
          <span className="font-display font-semibold text-ink-50">Rakshak</span>
        </div>
        <div className="max-w-sm">
          <h1 className="font-display text-3xl text-ink-50 leading-tight mb-3">
            Your logs, watched around the clock.
          </h1>
          <p className="text-ink-400 text-sm leading-relaxed">
            Rakshak parses your logs, flags suspicious activity, and explains
            what it found in plain language — so nothing slips through while
            you're not looking.
          </p>
        </div>
        <p className="text-[11px] font-mono text-ink-600">
          rakshak · ai cybersecurity assistant
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <SentinelMark size={32} animated={false} />
            <span className="font-display font-semibold text-ink-50">Rakshak</span>
          </div>

          <h2 className="font-display text-xl text-ink-50 mb-1">Log in</h2>
          <p className="text-sm text-ink-400 mb-6">Welcome back.</p>

          {error && (
            <div className="mb-4 rounded-md border border-severity-critical/30 bg-severity-critical/10 px-3 py-2 text-sm text-severity-critical">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 mb-1.5">
                Email
              </label>
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
              <label className="block text-xs font-mono text-ink-400 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
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
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-sm text-ink-400 mt-6">
            New to Rakshak?{" "}
            <Link to="/signup" className="text-sentinel-400 hover:text-sentinel-300">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
