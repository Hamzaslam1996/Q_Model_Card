"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SectionA,
  SectionB,
  SectionC,
  SectionD,
  SectionE,
  SectionF,
  SectionG,
  SectionH,
  SectionI,
  SectionJ,
} from "@/components/card-sections";
import type { ModelCard } from "@/lib/types";

const STORAGE_KEY = "q-card-generator:model-card";

export default function OutputPage() {
  const router = useRouter();
  const [modelCard, setModelCard] = useState<ModelCard | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (!cached) {
      router.push("/input");
      return;
    }
    try {
      const parsed = JSON.parse(cached) as ModelCard;
      setModelCard(parsed);
    } catch (error) {
      console.error("Unable to parse cached model card", error);
      setStatus("We could not load the generated model card. Please try again.");
    }
  }, [router]);

  const sections = useMemo(() => {
    if (!modelCard) return [];
    return [
      { component: SectionA, section: modelCard.sections.A },
      { component: SectionB, section: modelCard.sections.B },
      { component: SectionC, section: modelCard.sections.C },
      { component: SectionD, section: modelCard.sections.D },
      { component: SectionE, section: modelCard.sections.E },
      { component: SectionF, section: modelCard.sections.F },
      { component: SectionG, section: modelCard.sections.G },
      { component: SectionH, section: modelCard.sections.H },
      { component: SectionI, section: modelCard.sections.I },
      { component: SectionJ, section: modelCard.sections.J },
    ];
  }, [modelCard]);

  const handleDownloadJson = () => {
    if (!modelCard) return;
    const blob = new Blob([JSON.stringify(modelCard, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${modelCard.metadata.entityName || "q-card"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    setStatus("PDF export is not yet available in this MVP. Download the JSON instead.");
  };

  if (!modelCard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Generating your model card</CardTitle>
            <CardDescription>
              {status ?? "Preparing the validated content. You will be redirected shortly."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" onClick={() => router.push("/input")}>Return to input</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Quantum Model Card</h1>
          <p className="text-muted-foreground">
            Generated for {modelCard.metadata.entityName} in the {modelCard.metadata.technologyDomain} domain.
          </p>
        </header>

        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>High-level descriptors for this quantum system.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <span className="text-xs uppercase text-muted-foreground">Entity</span>
              <p className="text-lg font-medium">{modelCard.metadata.entityName || "Not specified"}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-muted-foreground">Entity Type</span>
              <p className="text-lg font-medium">{modelCard.metadata.entityType || "Not specified"}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-muted-foreground">Technology Domain</span>
              <p className="text-lg font-medium">{modelCard.metadata.technologyDomain || "Not specified"}</p>
            </div>
            <div>
              <span className="text-xs uppercase text-muted-foreground">Supporting File</span>
              <p className="text-lg font-medium">
                {modelCard.metadata.uploadedFileId
                  ? `${modelCard.metadata.uploadedFileId} (${((modelCard.metadata.uploadedFileSize ?? 0) / 1024).toFixed(2)} KB)`
                  : "None"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownloadJson}>Download JSON</Button>
          <Button variant="secondary" onClick={handleExportPdf}>
            Export PDF
          </Button>
          <Button variant="ghost" onClick={() => router.push("/input")}>Edit card</Button>
        </div>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map(({ component: Component, section }) => (
            <Component key={section.id} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}
