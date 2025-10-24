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

export interface ModelCardMetadata {
  entityName: string;
  entityType: string;
  technologyDomain: string;
  uploadedFileId?: string | null;
  uploadedFileSize?: number | null;
}

export interface ModelCard {
  metadata: ModelCardMetadata;
  sections: Record<ModelCardSectionId, ModelCardSection>;
}

export interface ValidationResult {
  valid: boolean;
  errors?: unknown[];
}
