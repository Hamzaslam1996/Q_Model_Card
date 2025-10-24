import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModelCardSection } from "@/lib/types";

interface SectionCardProps {
  section: ModelCardSection;
  accent?: string;
}

export function SectionCard({ section, accent }: SectionCardProps) {
  return (
    <Card className="h-full border-border/70 bg-card/70 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-xl font-semibold">
          {section.id}. {section.title}
        </CardTitle>
        {accent ? (
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            {accent}
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {section.body || "No information provided."}
        </p>
      </CardContent>
    </Card>
  );
}
