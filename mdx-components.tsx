import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

function CustomLink({ href, children, ...props }: React.ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

export function useMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="doc-h1">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="doc-h2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="doc-h3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="doc-h4">{children}</h4>
    ),
    p: ({ children }) => (
      <p className="doc-p">{children}</p>
    ),
    a: ({ href, children, ...props }) => (
      <CustomLink href={href} {...props}>
        {children}
      </CustomLink>
    ),
    ul: ({ children }) => (
      <ul className="doc-ul">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="doc-ol">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="doc-li">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="doc-blockquote">{children}</blockquote>
    ),
    pre: ({ children }) => (
      <pre className="doc-pre">{children}</pre>
    ),
    code: ({ children, className }) => {
      if (className) {
        return <code className={className}>{children}</code>
      }
      return <code className="doc-code-inline">{children}</code>
    },
    table: ({ children }) => (
      <div className="doc-table-wrapper">
        <table className="doc-table">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="doc-thead">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="doc-tr">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="doc-th">{children}</th>
    ),
    td: ({ children }) => (
      <td className="doc-td">{children}</td>
    ),
    hr: () => (
      <hr className="doc-hr" />
    ),
    img: ({ src, alt, ...props }) => (
      <img src={src} alt={alt} className="doc-img" {...props} />
    ),
    strong: ({ children }) => (
      <strong className="doc-strong">{children}</strong>
    ),
    em: ({ children }) => (
      <em>{children}</em>
    ),
  }
}
