import type { ModelCardSection } from "@/lib/types";
import { SectionCard } from "./SectionCard";

interface Props {
  section: ModelCardSection;
}

export function SectionH({ section }: Props) {
  return <SectionCard section={section} accent="Monitoring" />;
}
