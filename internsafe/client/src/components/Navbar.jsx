import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <span className="text-xl font-bold text-white">
            Intern<span className="text-brand">Safe</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Verify
          </Link>
          <Link
            to="/report"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Report a Company
          </Link>
          <a
            href="https://github.com/areebamakhmoor/internsafe"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
