import type { ModelCardSection } from "@/lib/types";
import { SectionCard } from "./SectionCard";

interface Props {
  section: ModelCardSection;
}

export function SectionB({ section }: Props) {
  return <SectionCard section={section} accent="Intended Use" />;
}
