import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-10 mb-4 text-3xl font-bold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-8 mb-3 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 text-xl font-semibold" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-border/60 p-4 text-sm leading-relaxed"
      {...props}
    />
  ),
  code: (props) => {
    const isInline = typeof props.children === "string";
    if (!isInline) return <code {...props} />;
    return (
      <code
        className="rounded-md bg-muted px-1.5 py-0.5 text-sm font-mono"
        {...props}
      />
    );
  },
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-border px-4 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),
  ul: (props) => <ul className="my-4 list-disc pl-6 space-y-1" {...props} />,
  ol: (props) => (
    <ol className="my-4 list-decimal pl-6 space-y-1" {...props} />
  ),
  li: (props) => <li className="text-muted-foreground" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
  p: (props) => (
    <p className="my-4 leading-relaxed text-muted-foreground" {...props} />
  ),
};
