import { Link } from "react-router-dom";

export default function JournalComingSoon() {
  const navbarApproxHeightPx = 180; // approximate space taken by fixed navbar/logo cluster

  return (
    <div
      className="w-full overflow-auto"
      style={{ height: "100vh", paddingTop: `${navbarApproxHeightPx}px` }}
    >
      <div
        className="flex items-start justify-center px-6"
        style={{ minHeight: `calc(100vh - ${navbarApproxHeightPx}px)` }}
      >
        <div className="text-center animate-fadeIn">
          <img
            src="/images/MMOJournal_logo.svg"
            alt="MMO Journal"
            className="mx-auto mb-6 w-[350px] max-w-[70vw] h-auto drop-shadow-[0_0_20px_rgba(255,203,5,0.25)]"
          />

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Journal Page
          </h1>

          <p className="mt-3 text-white/70 text-base sm:text-lg animate-slowPulse">
            Coming Soon
          </p>

          <div className="mt-8">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-full bg-[#ffcb05] px-6 py-2.5 text-black font-semibold shadow-md transition-transform transition-colors duration-200 hover:scale-105 hover:bg-[#e6b800] focus:outline-none focus:ring-2 focus:ring-[#ffcb05]/40"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Local animations scoped to this route */}
      <style>{`
        @keyframes fadeInRoute {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeInRoute 0.5s ease-out both; }

        @keyframes slowPulseOpacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-slowPulse { animation: slowPulseOpacity 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}


