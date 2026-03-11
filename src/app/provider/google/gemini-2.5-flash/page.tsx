import Link from "next/link";

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

export default function Gemini25FlashPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="scanlines" />

      <div className="max-w-4xl mx-auto">
        <div className="card-terminal mb-6">
          <div className="card-terminal-header">
            +-- {MODEL_NAME.toUpperCase()} --+
          </div>
          <div className="p-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm hover:text-glow transition-all mb-4"
            >
              &lt; BACK TO TERMINAL
            </Link>

            <h1 className="text-xl md:text-2xl font-bold text-glow mb-2">
              &gt; {MODEL_NAME}_
              <span className="animate-blink">█</span>
            </h1>
            <p className="text-sm opacity-60">
              $ Google AI Flash Model - Fast Response
            </p>
          </div>
        </div>

        <div className="card-terminal mb-6">
          <div className="card-terminal-header">
            +-- INPUT --+
          </div>
          <div className="p-4">
            <div>
              <label className="block text-xs mb-2 opacity-60">
                user@api-test:~$
              </label>
              <textarea
                placeholder="Enter your prompt..."
                className="w-full bg-transparent border border-[#1f521f] p-3 text-sm focus:border-[#33ff00] focus:outline-none resize-none"
                rows={4}
              />
            </div>
            <button className="btn-terminal mt-4">
              [ SEND ]
            </button>
          </div>
        </div>

        <div className="card-terminal">
          <div className="card-terminal-header">
            +-- OUTPUT --+
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm font-mono text-glow opacity-60">
              [WAITING FOR INPUT...]
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
