export type ModelCardSectionId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J";

export interface ModelCardSection {
  id: ModelCardSectionId;
  title: string;
  body: string;
}

export interface ModelCardSections {
  A: ModelCardSection;
  B: ModelCardSection;
  C: ModelCardSection;
  D: ModelCardSection;
  E: ModelCardSection;
  F: ModelCardSection;
  G: ModelCardSection;
  H: ModelCardSection;
  I: ModelCardSection;
  J: ModelCardSection;
}

export interface ModelCardMetadata {
  entityName: string;
  entityType: string;
  technologyDomain: string;
  uploadedFileId?: string | null;
  uploadedFileSize?: number | null;
}

export interface ModelCard {
  metadata: ModelCardMetadata;
  sections: ModelCardSections;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
