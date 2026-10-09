import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: (props) => <h2 className="display mt-10 mb-4 text-3xl first:mt-0" {...props} />,
  h2: (props) => <h2 className="display mt-8 mb-3 text-2xl" {...props} />,
  h3: (props) => <h3 className="display mt-6 mb-2 text-xl" {...props} />,
  a: (props) => (
    <a
      className="font-medium text-red underline underline-offset-4"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  pre: (props) => (
    <pre className="my-6 overflow-x-auto rounded-[3px] border border-ink/40 p-4 text-sm leading-relaxed" {...props} />
  ),
  code: (props) => {
    const isInline = typeof props.children === "string";
    if (!isInline) return <code {...props} />;
    return <code className="rounded-[3px] border border-ink/20 bg-enamel px-1.5 py-0.5 font-mono text-sm" {...props} />;
  },
  blockquote: (props) => (
    <blockquote className="my-6 border-l-2 border-red pl-4 font-display italic" {...props} />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props) => <th className="border border-ink/30 px-4 py-2 text-left font-semibold" {...props} />,
  td: (props) => <td className="border border-ink/20 px-4 py-2" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6" {...props} />,
  li: (props) => <li {...props} />,
  hr: () => <hr className="my-8 border-ink/20" />,
  p: (props) => <p className="my-4 leading-relaxed" {...props} />,
};
