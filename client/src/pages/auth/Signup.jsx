import { Link } from "react-router-dom";
import SentinelMark from "../../components/ui/SentinelMark";

export default function Signup() {
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
            Auth wiring lands in Step 5 (JWT authentication).
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 mb-1.5">Name</label>
              <input
                disabled
                placeholder="Jane Doe"
                className="w-full rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-600 disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-sentinel-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 mb-1.5">Email</label>
              <input
                disabled
                placeholder="you@company.com"
                className="w-full rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-600 disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-sentinel-400"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 mb-1.5">Password</label>
              <input
                disabled
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-600 disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-sentinel-400"
              />
            </div>
            <button
              disabled
              className="w-full rounded-md bg-sentinel-400 px-3 py-2 text-sm font-medium text-ink-950 opacity-60 shadow-glow"
            >
              Sign up
            </button>
          </div>

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
