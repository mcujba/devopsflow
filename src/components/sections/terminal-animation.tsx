"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  command: string;
  output: string[];
  delay: number;
}

const commands: TerminalLine[] = [
  {
    command: "kubectl apply -f deployment.yaml",
    output: [
      "deployment.apps/devopsflow created",
      "service/devopsflow-svc created",
    ],
    delay: 0,
  },
  {
    command: "docker build -t devopsflow:latest .",
    output: [
      "=> [build 3/3] RUN npm run build",
      "=> exporting to image",
      "Successfully built a3f2e8b1c5d7",
    ],
    delay: 3000,
  },
  {
    command: "terraform plan",
    output: [
      "Plan: 12 to add, 0 to change, 0 to destroy.",
      "",
      "Changes to Outputs:",
      '  + endpoint = "devopsflow.io"',
    ],
    delay: 6000,
  },
  {
    command: "helm upgrade --install monitoring prometheus",
    output: [
      'Release "monitoring" has been upgraded.',
      "STATUS: deployed",
      "REVISION: 7",
    ],
    delay: 9000,
  },
];

function TypingText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{displayed}</>;
}

function TerminalBlock({ line }: { line: TerminalLine }) {
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    const commandDuration = line.command.length * 30 + 400;
    const timer = setTimeout(() => setShowOutput(true), commandDuration);
    return () => clearTimeout(timer);
  }, [line.command.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: line.delay / 1000 }}
      className="mb-3"
    >
      <div className="flex items-start gap-2">
        <span className="select-none text-primary">$</span>
        <span className="text-foreground">
          <TypingText text={line.command} />
        </span>
        {!showOutput && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block h-4 w-1.5 translate-y-0.5 bg-primary"
          />
        )}
      </div>
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-1 pl-5"
          >
            {line.output.map((outputLine, i) => (
              <div
                key={i}
                className={`text-muted-foreground ${
                  outputLine.includes("Successfully") ||
                  outputLine.includes("created") ||
                  outputLine.includes("deployed") ||
                  outputLine.includes("upgraded")
                    ? "text-emerald-400"
                    : outputLine.includes("Plan:") ||
                        outputLine.includes("endpoint")
                      ? "text-amber-400"
                      : ""
                }`}
              >
                {outputLine || "\u00A0"}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function TerminalAnimation() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const totalDuration = 12000 + 2000;
    const timer = setInterval(() => setCycle((c) => c + 1), totalDuration);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/5">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-muted-foreground font-mono">
          devops@devopsflow ~ %
        </span>
      </div>

      {/* Terminal content */}
      <div className="p-4 font-mono text-sm leading-relaxed min-h-[280px]" key={cycle}>
        {commands.map((line, i) => (
          <TerminalBlock key={`${cycle}-${i}`} line={line} />
        ))}
      </div>
    </div>
  );
}
