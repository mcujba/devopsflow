export interface LcdReading {
  label: string;
  value: string;
}

export function Lcd({ items }: { items: LcdReading[] }) {
  return (
    <dl className="lcd">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
