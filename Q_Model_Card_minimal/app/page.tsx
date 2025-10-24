import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/40 to-background p-6 text-center">
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-border bg-card/80 p-10 shadow-lg backdrop-blur">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Q-Card Generator
        </h1>
        <p className="text-muted-foreground">
          Capture and validate comprehensive Quantum Model Cards aligned with Mark Everitt&apos;s 2024 specification. Start by describing your entity and outlining sections A–J, then generate a validated card ready for review.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/input">
            Launch Builder
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
