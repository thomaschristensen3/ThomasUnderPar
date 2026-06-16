import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-gray-900 mt-10 mb-4 tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-100 tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-5">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-5 space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-5 space-y-1 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gold pl-5 my-6 italic text-gray-600">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-forest underline underline-offset-2 hover:text-forest-dark transition-colors"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-8 border-gray-100" />,
};

export default function MarkdownBody({ body }: { body: string }) {
  return (
    <div className="text-base">
      <ReactMarkdown components={components}>{body}</ReactMarkdown>
    </div>
  );
}
