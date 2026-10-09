interface UnitProps {
  id?: string;
  className?: string;
  labelledBy?: string;
  children: React.ReactNode;
}

function Ear({ right = false }: { right?: boolean }) {
  return (
    <div className={right ? "ear ear-right" : "ear"} aria-hidden="true">
      <span className="ear-hole" />
      <span className="ear-hole" />
    </div>
  );
}

export function Unit({ id, className = "", labelledBy, children }: UnitProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`unit ${className}`.trim()}>
      <Ear />
      <div className="unit-face">{children}</div>
      <Ear right />
    </section>
  );
}
