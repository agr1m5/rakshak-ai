import { Link } from "react-router-dom";
import SentinelMark from "../components/ui/SentinelMark";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center bg-ink-950 gap-4">
      <SentinelMark size={40} animated={false} />
      <div>
        <h1 className="font-display text-3xl text-ink-50 mb-1">404</h1>
        <p className="text-ink-400 text-sm mb-4">
          Rakshak didn't find anything watching this page.
        </p>
        <Link to="/dashboard" className="text-sentinel-400 hover:text-sentinel-300 text-sm">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
