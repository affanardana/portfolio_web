const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Renders a paragraph string, turning [label](url) into a real link.
 * Deliberately tiny - the copy only ever needs inline links, nothing more.
 */
export default function RichText({ text, linkClassName }) {
  const nodes = [];
  let cursor = 0;

  LINK_PATTERN.lastIndex = 0;

  for (let match = LINK_PATTERN.exec(text); match; match = LINK_PATTERN.exec(text)) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    nodes.push(
      <a
        key={`${match.index}-${match[2]}`}
        href={match[2]}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClassName}
      >
        {match[1]}
      </a>,
    );

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));

  return <>{nodes}</>;
}
