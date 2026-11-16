import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeleteSequence } from "@/hooks/useSequences";
import type { Sequence } from "@/types/database";
import { Film, Trash2Icon } from "lucide-react";

export function SequenceCard({ sequence }: { sequence: Sequence }) {
  const deleteSequence = useDeleteSequence();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${sequence.title}" and all its shots?`)) return;
    deleteSequence.mutate(sequence.id, {
      onError: (err) => toast.error((err as Error).message),
    });
  };

  return (
    <Link to={`/sequences/${sequence.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <span className="mb-1 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Film className="size-4" />
          </span>
          <CardTitle className="font-display tracking-wide">{sequence.title}</CardTitle>
          {sequence.description && (
            <CardDescription className="line-clamp-2">{sequence.description}</CardDescription>
          )}
          <CardAction>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete sequence"
              className="text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteSequence.isPending}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
