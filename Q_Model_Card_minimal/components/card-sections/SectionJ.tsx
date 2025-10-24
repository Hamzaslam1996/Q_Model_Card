import type { ModelCardSection } from "@/lib/types";
import { SectionCard } from "./SectionCard";

interface Props {
  section: ModelCardSection;
}

export function SectionJ({ section }: Props) {
  return <SectionCard section={section} accent="Ethics" />;
}
