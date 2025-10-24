import type { ModelCardSection } from "@/lib/types";
import { SectionCard } from "./SectionCard";

interface Props {
  section: ModelCardSection;
}

export function SectionG({ section }: Props) {
  return <SectionCard section={section} accent="Deployment" />;
}
