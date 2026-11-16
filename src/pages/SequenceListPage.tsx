import { useSequences } from "@/hooks/useSequences";
import { SequenceCard } from "@/components/sequences/SequenceCard";
import { NewSequenceDialog } from "@/components/sequences/NewSequenceDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "lucide-react";

export function SequenceListPage() {
  const { data: sequences, isLoading, isError, error } = useSequences();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wide text-foreground">Sequences</h1>
          <p className="text-sm text-muted-foreground">Every scene you're breaking down into shots.</p>
        </div>
        <NewSequenceDialog />
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {isError && <p className="text-sm text-destructive">{(error as Error).message}</p>}

      {sequences && sequences.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <Film className="size-6 opacity-60" />
          <p className="text-sm">No sequences yet</p>
          <p className="text-xs">Create one to start storyboarding.</p>
        </div>
      )}

      {sequences && sequences.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sequences.map((sequence) => (
            <SequenceCard key={sequence.id} sequence={sequence} />
          ))}
        </div>
      )}
    </div>
  );
}
