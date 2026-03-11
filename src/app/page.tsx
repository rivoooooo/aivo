import Link from "next/link";

interface Model {
  name: string;
  description: string;
  href: string;
}

interface Provider {
  name: string;
  models: Model[];
  settingsHref: string;
}

const providers: Provider[] = [
  {
    name: "Google",
    models: [
      { name: "gemini-2.5-flash", description: "快速响应", href: "/provider/google/gemini-2.5-flash" },
      { name: "gemini-3-pro", description: "高级模型", href: "/provider/google/gemini-3-pro" },
      { name: "gemini-2.0-flash", description: "均衡选择", href: "/provider/google/gemini-2.0-flash" },
    ],
    settingsHref: "/provider/google/settings",
  },
  {
    name: "Z AI",
    models: [
      { name: "z-ai-max", description: "旗舰模型", href: "/provider/z/z-ai-max" },
      { name: "z-ai-pro", description: "专业模型", href: "/provider/z/z-ai-pro" },
    ],
    settingsHref: "/provider/z/settings",
  },
  {
    name: "Doubao",
    models: [
      { name: "doubao-pro", description: "专业模型", href: "/provider/doubao/doubao-pro" },
      { name: "doubao-lite", description: "轻量模型", href: "/provider/doubao/doubao-lite" },
    ],
    settingsHref: "/provider/doubao/settings",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="scanlines" />
      
      <div className="max-w-6xl mx-auto">
        <div className="card-terminal mb-8">
          <div className="card-terminal-header">
            +-- AI API TERMINAL --+
          </div>
          <div className="p-4">
            <h1 className="text-2xl md:text-4xl font-bold text-glow mb-2">
              &gt; AI API TEST_
              <span className="animate-blink">█</span>
            </h1>
            <p className="text-sm opacity-70">
              {`$ curl -X POST /api/providers --data '{"action": "test"}'`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div key={provider.name} className="card-terminal">
              <div className="card-terminal-header flex justify-between items-center">
                <span>+-- {provider.name.toUpperCase()} --+</span>
                <Link 
                  href={provider.settingsHref} 
                  className="text-[10px] hover:text-glow transition-all opacity-60 hover:opacity-100"
                >
                  [SETTINGS]
                </Link>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {provider.models.map((model) => (
                  <Link
                    key={model.name}
                    href={model.href}
                    className="block p-3 border border-[#1f521f] hover:border-[#33ff00] transition-all duration-150 group"
                  >
                    <span className="block text-sm font-bold text-glow group-hover:text-glow">
                      &gt; {model.name}
                    </span>
                    <span className="text-xs opacity-60">
                      $ {model.description}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="text-xs opacity-40 mt-2">
                [{provider.models.length} MODULES LOADED]
              </div>
            </div>
          ))}
        </div>

        <div className="card-terminal mt-8">
          <div className="card-terminal-header">
            +-- SYSTEM STATUS --+
          </div>
          <div className="p-4 text-sm font-mono">
            <div className="flex justify-between mb-1">
              <span>PROVIDERS:</span>
              <span>[OK] {providers.length}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>MODELS:</span>
              <span>[OK] {providers.reduce((acc, p) => acc + p.models.length, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span>[READY]</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs opacity-40">
          &gt; root@api-test:~# _
          <span className="animate-blink">█</span>
        </div>
      </div>
    </main>
  );
}
