const PIPELINE = [
  { step: "build", time: "41s" },
  { step: "test", time: "1m 12s" },
  { step: "scan", time: "23s" },
  { step: "deploy", time: "38s" },
] as const;

export function CodeWindow() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-12 grid max-w-4xl overflow-hidden rounded-[14px] border border-border bg-card text-left font-mono text-xs leading-7 md:grid-cols-[1.25fr_1fr]"
    >
      <div>
        <div className="border-b border-border px-4 py-2 text-muted-foreground">deploy.yml</div>
        <pre className="overflow-x-auto px-4 py-3 text-muted-foreground">
          <span className="text-primary">jobs</span>:{"\n"}
          {"  "}
          <span className="text-primary">deploy</span>:{"\n"}
          {"    "}
          <span className="text-primary">runs-on</span>: ubuntu-latest{"\n"}
          {"    "}
          <span className="text-primary">steps</span>:{"\n"}
          {"      "}- <span className="text-primary">run</span>: helm upgrade --atomic api ./chart{"\n"}
          {"      "}# rollback is automatic on failure
        </pre>
      </div>
      <div className="border-t border-border md:border-l md:border-t-0">
        <div className="border-b border-border px-4 py-2 text-muted-foreground">pipeline</div>
        <ul className="px-4 py-3 text-muted-foreground">
          {PIPELINE.map(({ step, time }) => (
            <li key={step} className="flex justify-between">
              <span>
                <span className="text-emerald-600 dark:text-emerald-400">✓</span> {step}
              </span>
              <span>{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
