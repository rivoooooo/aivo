import Link from "next/link";

interface Question {
  id: number;
  question: string;
  options?: string[];
  answer?: string;
  code?: string;
}

interface Challenge {
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  category: string;
  questions: Question[];
}

const challenges: Record<string, Challenge> = {
  "event-loop": {
    slug: "event-loop",
    title: "JavaScript Event Loop",
    description: "深入理解 JavaScript 事件循环机制",
    difficulty: "MEDIUM",
    category: "FRONTEND PRINCIPLES",
    questions: [
      {
        id: 1,
        question: "以下代码的输出顺序是什么?",
        code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
        options: ["1 2 3 4", "1 4 3 2", "1 4 2 3", "2 1 3 4"],
        answer: "1 4 3 2"
      },
      {
        id: 2,
        question: "Microtask Queue 包含哪些内容?",
        options: ["setTimeout", "Promise.then", "MutationObserver", "setImmediate"],
        answer: "Promise.then"
      },
      {
        id: 3,
        question: "以下代码的输出顺序是?",
        code: `async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}
async function async2() {
  console.log('3');
}
console.log('4');
async1();
console.log('5');`,
        options: ["4 1 3 5 2", "1 3 4 5 2", "4 5 1 3 2", "4 1 5 3 2"],
        answer: "4 1 3 5 2"
      }
    ]
  },
  "prompt-engineering": {
    slug: "prompt-engineering",
    title: "Prompt Engineering",
    description: "掌握 AI 提示词编写技巧",
    difficulty: "EASY",
    category: "AI CHALLENGES",
    questions: [
      {
        id: 1,
        question: "以下哪个是更好的 Prompt 结构?",
        options: [
          "写一个函数",
          "写一个 JavaScript 函数,函数名为 calculateSum,接收两个数字参数 a 和 b,返回它们的和,使用 TypeScript,添加 JSDoc 注释",
          "写个求和函数",
          "写函数"
        ],
        answer: "写一个 JavaScript 函数,函数名为 calculateSum,接收两个数字参数 a 和 b,返回它们的和,使用 TypeScript,添加 JSDoc 注释"
      },
      {
        id: 2,
        question: "Few-shot Prompting 是什么?",
        options: [
          "给 AI 很长的提示",
          "在提示中包含少量示例",
          "多次调用 AI",
          "使用角色提示"
        ],
        answer: "在提示中包含少量示例"
      }
    ]
  }
};

const difficultyColors: Record<string, string> = {
  EASY: "var(--success)",
  MEDIUM: "var(--warning)",
  HARD: "var(--chart-3)",
  EXPERT: "var(--error)",
};

export default function ChallengePage({ params }: { params: { slug: string } }) {
  const challenge = challenges[params.slug];

  if (!challenge) {
    return (
      <main className="min-h-screen">
        <div className="scanlines" />
        <nav className="border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex justify-between items-center h-14">
              <Link href="/en" className="text-sm font-bold tracking-wider text-glow">
                &gt; AI ERA_
              </Link>
              <div className="flex items-center gap-4 md:gap-6 text-xs">
                <Link href="/en" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                  [HOME]
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="card-terminal">
            <div className="card-terminal-header">
              +-- ERROR --+
            </div>
            <div className="p-8 text-center">
              <p className="text-lg mb-4">Challenge not found</p>
              <Link href="/en/challenge" className="btn-terminal inline-block">
                [BACK TO CHALLENGES]
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="scanlines" />
      
      <nav className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/en" className="text-sm font-bold tracking-wider text-glow">
              &gt; AI ERA_
            </Link>
            <div className="flex items-center gap-4 md:gap-6 text-xs">
              <Link href="/en" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [HOME]
              </Link>
              <Link href="/en/challenge" className="hover:text-glow transition-all opacity-70 hover:opacity-100">
                [CHALLENGES]
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <div className="text-xs opacity-60 mb-2">/challenge/{challenge.slug}</div>
          <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">
            {challenge.title}
          </h1>
          <p className="text-sm opacity-60 mb-4">{challenge.description}</p>
          <div className="flex gap-4 text-xs">
            <span 
              className="px-2 py-1 font-bold"
              style={{ 
                color: difficultyColors[challenge.difficulty],
                border: `1px solid ${difficultyColors[challenge.difficulty]}`
              }}
            >
              {challenge.difficulty}
            </span>
            <span className="opacity-60 py-1">{challenge.category}</span>
          </div>
        </div>

        <div className="space-y-6">
          {challenge.questions.map((q, index) => (
            <div key={q.id} className="card-terminal">
              <div className="card-terminal-header">
                +-- QUESTION {index + 1} --+
              </div>
              <div className="p-4">
                <p className="text-sm mb-4 font-bold">
                  {q.id}. {q.question}
                </p>
                
                {q.code && (
                  <pre className="bg-background border border-border p-4 mb-4 text-xs md:text-sm overflow-x-auto">
                    <code>{q.code}</code>
                  </pre>
                )}

                {q.options && (
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <label 
                        key={optIndex}
                        className="flex items-start gap-3 p-3 border border-border hover:bg-muted hover:text-foreground cursor-pointer transition-all"
                      >
                        <input 
                          type="radio" 
                          name={`question-${q.id}`}
                          className="mt-0.5 accent-primary"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="btn-terminal text-lg px-8 py-3">
            [SUBMIT ANSWERS]
          </button>
        </div>

        <div className="mt-8 text-center text-xs opacity-40">
          &gt; root@ai-era:~/challenge/{challenge.slug}# _
          <span className="animate-blink">█</span>
        </div>
      </div>
    </main>
  );
}
