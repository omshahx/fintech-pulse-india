import { Badge } from "../ui/Badge";

const SOURCE_STYLES: Record<string, string> = {
  "google-news": "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  inc42: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  rbi: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

interface SourceBadgeProps {
  sourceId: string;
  sourceName: string;
}

export function SourceBadge({ sourceId, sourceName }: SourceBadgeProps) {
  return (
    <Badge variant="category" className={SOURCE_STYLES[sourceId] || ""}>
      {sourceName}
    </Badge>
  );
}
