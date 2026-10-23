import { MarkdownContent } from "./MarkdownContent";

interface ArticleListProps {
  items: string[];
  ordered: boolean;
}

export function ArticleList({ items, ordered }: ArticleListProps) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag
      className={`my-4 space-y-2 pl-6 leading-relaxed ${ordered ? "list-decimal" : "list-disc"}`}
      style={{ color: "var(--text)" }}
    >
      {items.map((item, index) => (
        <li key={`${index}-${item}`}><MarkdownContent source={item} /></li>
      ))}
    </ListTag>
  );
}