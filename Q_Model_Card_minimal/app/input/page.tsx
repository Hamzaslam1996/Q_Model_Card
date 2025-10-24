"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  ModelCard,
  ModelCardSection,
  ModelCardSectionId,
  ValidationResult,
} from "@/lib/types";

interface SectionTemplate {
  id: ModelCardSectionId;
  title: string;
  placeholder: string;
}

const sectionTemplates: SectionTemplate[] = [
  {
    id: "A",
    title: "Background & Motivation",
    placeholder: "Describe the overarching mission, stakeholders, and motivations behind the quantum model.",
  },
  {
    id: "B",
    title: "Intended Use & Users",
    placeholder: "Outline target users, primary use cases, and expected impact of deployment.",
  },
  {
    id: "C",
    title: "Model Architecture",
    placeholder: "Summarise algorithms, circuit structures, hybrid classical/quantum elements, and major dependencies.",
  },
  {
    id: "D",
    title: "Training Configuration",
    placeholder: "Document training regimes, hardware configurations, hyperparameters, and notable decisions.",
  },
  {
    id: "E",
    title: "Datasets & Inputs",
    placeholder: "List datasets, provenance, licensing, preprocessing, and representational limits.",
  },
  {
    id: "F",
    title: "Evaluation & Verification",
    placeholder: "Explain metrics, benchmarks, validation experiments, and verification status.",
  },
  {
    id: "G",
    title: "Deployment Guidance",
    placeholder: "Cover operational constraints, integration notes, interfaces, and rollout guidance.",
  },
  {
    id: "H",
    title: "Monitoring & Maintenance",
    placeholder: "Define monitoring plans, fallback strategies, guardrails, and update cadence.",
  },
  {
    id: "I",
    title: "Governance & Compliance",
    placeholder: "Describe governance frameworks, approvals, and regulatory obligations.",
  },
  {
    id: "J",
    title: "Ethics & Societal Considerations",
    placeholder: "Summarise ethical considerations, known risks, and stakeholder engagement.",
  },
];

const entityTypes = ["Academic", "Commercial", "Consortium", "Government", "Non-profit", "Other"];
const domains = [
  "Quantum Computing",
  "Quantum Communication",
  "Quantum Sensing",
  "Quantum Simulation",
  "Quantum Security",
  "Hybrid Quantum-Classical",
  "Other",
];

const STORAGE_KEY = "q-card-generator:model-card";

export default function InputPage() {
  const router = useRouter();
  const [entityName, setEntityName] = useState("");
  const [entityType, setEntityType] = useState(entityTypes[0] ?? "");
  const [technologyDomain, setTechnologyDomain] = useState(domains[0] ?? "");
  const [sections, setSections] = useState<Record<ModelCardSectionId, ModelCardSection>>(() => {
    return sectionTemplates.reduce((acc, template) => {
      acc[template.id] = {
        id: template.id,
        title: template.title,
        body: "",
      };
      return acc;
    }, {} as Record<ModelCardSectionId, ModelCardSection>);
  });
  const [fileInfo, setFileInfo] = useState<{ fileId: string; size: number } | null>(null);
  const [errors, setErrors] = useState<unknown[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as ModelCard;
      setEntityName(parsed.metadata.entityName);
      setEntityType(parsed.metadata.entityType);
      setTechnologyDomain(parsed.metadata.technologyDomain);
      setSections(parsed.sections);
      if (parsed.metadata.uploadedFileId) {
        setFileInfo({
          fileId: parsed.metadata.uploadedFileId,
          size: parsed.metadata.uploadedFileSize ?? 0,
        });
      }
    } catch (error) {
      console.error("Unable to restore cached model card", error);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);


  const handleSectionChange = (id: ModelCardSectionId, body: string) => {
    setSections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        body,
      },
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setStatusMessage("Uploading file...");
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Upload failed");
      }
      setFileInfo({ fileId: payload.fileId, size: payload.size });
      setStatusMessage(`Uploaded file (${(payload.size / 1024).toFixed(1)} KB)`);
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to upload file. Please try again.");
      setFileInfo(null);
    }
  };

  const handleGenerate = async () => {
    setIsSubmitting(true);
    setErrors([]);
    setStatusMessage("Validating model card...");

    const modelCard: ModelCard = {
      metadata: {
        entityName,
        entityType,
        technologyDomain,
        uploadedFileId: fileInfo?.fileId ?? null,
        uploadedFileSize: fileInfo?.size ?? null,
      },
      sections,
    };

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modelCard),
      });
      const payload = (await response.json()) as ValidationResult;
      if (response.ok && payload.valid) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(modelCard));
        setStatusMessage("Model card validated. Redirecting...");
        router.push("/output");
      } else {
        setErrors(payload.errors ?? ["Model card is invalid."]);
        setStatusMessage("Validation failed.");
      }
    } catch (error) {
      console.error(error);
      setErrors(["Unexpected error validating model card."]);
      setStatusMessage("Validation failed due to a network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background pb-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-2 text-left">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Build your Quantum Model Card</h1>
          <p className="text-muted-foreground">
            Provide high-level metadata, optionally upload supporting documentation, and outline the contents for Mark Everitt&apos;s sections A–J. Your submission will be validated against the official schema before publishing.
          </p>
        </header>

        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Entity Metadata</CardTitle>
            <CardDescription>Basic descriptors for the organisation and technology focus.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="entity-name">Entity Name</Label>
              <Input
                id="entity-name"
                placeholder="Quantum Systems Lab"
                value={entityName}
                onChange={(event) => setEntityName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity-type">Entity Type</Label>
              <Select
                id="entity-type"
                value={entityType}
                onChange={(event) => setEntityType(event.target.value)}
              >
                {entityTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="technology-domain">Technology Domain</Label>
              <Select
                id="technology-domain"
                value={technologyDomain}
                onChange={(event) => setTechnologyDomain(event.target.value)}
              >
                {domains.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supporting-file">Upload Supporting File</Label>
              <Input
                id="supporting-file"
                type="file"
                accept=".json,.pdf,application/json,application/pdf"
                onChange={handleFileUpload}
              />
              {fileInfo ? (
                <p className="text-xs text-muted-foreground">
                  Attached file ID {fileInfo.fileId} • {(fileInfo.size / 1024).toFixed(2)} KB
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF or JSON. Files are not stored after validation.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {sectionTemplates.map((template) => {
            const section = sections[template.id];
            return (
              <Card key={template.id} className="border-border/70 bg-card/70">
                <CardHeader>
                  <CardTitle>
                    {template.id}. {template.title}
                  </CardTitle>
                  <CardDescription>{template.placeholder}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={section.body}
                    onChange={(event) => handleSectionChange(template.id, event.target.value)}
                    placeholder={template.placeholder}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border/80 bg-card/60 p-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span className="font-medium text-foreground">Ready to generate your model card?</span>
            <Button onClick={handleGenerate} disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Validating..." : "Generate Model Card"}
            </Button>
          </div>
          {statusMessage ? <span>{statusMessage}</span> : null}
          {errors.length > 0 ? (
            <ul className="list-inside list-disc text-destructive">
              {errors.map((error, index) => (
                <li key={index}>{typeof error === "string" ? error : JSON.stringify(error)}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </main>
  );
}
