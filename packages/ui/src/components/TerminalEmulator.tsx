"use client"

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TerminalLine {
  type: "input" | "output"
  content: string
}

interface CommandDefinition {
  name: string
  output: string
  action?: "navigate" | "none"
  href?: string
}

const COMMANDS: CommandDefinition[] = [
  {
    name: "help",
    output: `Available commands:
  help     - Show this help message
  start    - Start your first challenge
  daily    - Run today's daily challenge
  run      - Run current challenge (requires daily)
  modules  - Browse challenge modules
  sandbox  - Open code sandbox
  rank     - View leaderboard
  clear    - Clear terminal`,
  },
  {
    name: "start",
    output: "Starting your journey...",
    action: "navigate",
    href: "/en/challenge",
  },
  {
    name: "daily",
    output: "Loading daily challenge...",
    action: "navigate",
    href: "/en/challenge?mode=daily",
  },
  {
    name: "run",
    output: "Error: No active challenge. Run 'daily' first to start a challenge.",
  },
  {
    name: "modules",
    output: `Available modules:
  frontend  - Frontend challenges
  javascript - JavaScript practice
  react     - React patterns
  typescript - TypeScript mastery`,
  },
  {
    name: "sandbox",
    output: "Opening sandbox environment...",
    action: "navigate",
    href: "/en/challenge/sandbox/playground",
  },
  {
    name: "rank",
    output: `🏆 Leaderboard
#1  developer_42   1250 pts
#2  code_master    1180 pts  
#3  frontend_pro   1050 pts
#4  js_ninja       980 pts
#5  react_guru     920 pts`,
  },
  {
    name: "clear",
    output: "",
  },
]

interface TerminalEmulatorProps {
  className?: string
  dailyShown?: boolean
  isVisible?: boolean
}

export function TerminalEmulator({ className, dailyShown: _dailyShown = false, isVisible = true }: TerminalEmulatorProps) {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "output",
      content: "> AI-Era connected. type a command or click below to get started.",
    },
  ])
  const [isInitialized, setIsInitialized] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsInitialized(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsInitialized(false)
    }
  }, [isVisible])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim().toLowerCase()
      const newLines: TerminalLine[] = [...lines, { type: "input", content: `> ${cmd}` }]

      if (trimmedCmd === "") {
        setLines(newLines)
        return
      }

      if (trimmedCmd === "clear") {
        setLines([])
        setHistory((prev) => [cmd, ...prev.filter((c) => c !== cmd)].slice(0, 50))
        setHistoryIndex(-1)
        setInput("")
        return
      }

      const commandDef = COMMANDS.find((c) => c.name === trimmedCmd)

      if (commandDef) {
        newLines.push({ type: "output", content: commandDef.output })

        if (commandDef.action === "navigate" && commandDef.href) {
          const delay = trimmedCmd === "run" ? 1000 : 800
          setTimeout(() => {
            router.push(commandDef.href!)
          }, delay)
        }
      } else {
        newLines.push({
          type: "output",
          content: `Command not found: ${cmd}. Type 'help' for available commands.`,
        })
      }

      setLines(newLines)
      setHistory((prev) => [cmd, ...prev.filter((c) => c !== cmd)].slice(0, 50))
      setHistoryIndex(-1)
      setInput("")
    },
    [lines, router]
  )

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    executeCommand(input)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex + 1
        if (newIndex < history.length) {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Escape") {
      setInput("")
      setHistoryIndex(-1)
    }
  }

  const handleButtonClick = (cmd: string) => {
    executeCommand(cmd)
    inputRef.current?.focus()
  }

  const quickCommands = [
    { name: "start", label: "start" },
    { name: "daily", label: "daily" },
    { name: "modules", label: "modules" },
    { name: "rank", label: "rank" },
    { name: "sandbox", label: "sandbox" },
  ]

  return (
    <div
      className={cn(
        "font-mono rounded-lg border border-border bg-background/95 backdrop-blur-sm overflow-hidden",
        "transition-opacity duration-400",
        isInitialized ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground ml-2">TERMINAL</span>
      </div>

      <div
        ref={outputRef}
        className="p-4 max-h-[200px] overflow-y-auto text-[13px] leading-[1.6]"
      >
        {lines.map((line, index) => (
          <div key={index} className={line.type === "input" ? "mt-1" : "mt-0"}>
            {line.content}
          </div>
        ))}
      </div>

      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-3 mb-3">
          {quickCommands.map((cmd) => (
            <Button
              key={cmd.name}
              variant="outline"
              size="sm"
              onClick={() => handleButtonClick(cmd.name)}
              className="font-mono text-xs"
            >
              {cmd.label}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-[13px] text-foreground shrink-0">{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-muted-foreground/50"
            placeholder={input === "" ? "█" : ""}
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}
