import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeftIcon, Clapperboard, Clock, Loader2, Wand2 } from "lucide-react";
import { useSequence } from "@/hooks/useSequences";
import { useShots, useCreateShot, useUpdateShot, useDeleteShot } from "@/hooks/useShots";
import { useGenerateShotImage } from "@/hooks/useGenerateShotImage";
import { useUpdateSequence } from "@/hooks/useSequences";
import { StoryboardBoard } from "@/components/storyboard/StoryboardBoard";
import { ShotDialog } from "@/components/storyboard/ShotDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Shot } from "@/types/database";
import type { ShotFields } from "@/services/shots";

interface DialogState {
  open: boolean;
  shot: Shot | null;
}

export function StoryboardEditorPage() {
  const { sequenceId = "" } = useParams();
  const { data: sequence, isLoading: sequenceLoading } = useSequence(sequenceId);
  const { data: shots, isLoading: shotsLoading, isError, error } = useShots(sequenceId);

  const createShot = useCreateShot(sequenceId);
  const updateShot = useUpdateShot(sequenceId);
  const deleteShot = useDeleteShot(sequenceId);
  const generateShotImage = useGenerateShotImage(sequenceId, sequence);
  const updateSequence = useUpdateSequence();

  const [dialog, setDialog] = useState<DialogState>({ open: false, shot: null });
  const [generatingAll, setGeneratingAll] = useState(false);
  const [title, setTitle] = useState(sequence?.title ?? "");
  const [description, setDescription] = useState(sequence?.description ?? "");

  useEffect(() => {
    setTitle(sequence?.title ?? "");
    setDescription(sequence?.description ?? "");
  }, [sequence?.id, sequence?.title, sequence?.description]);

  const stats = useMemo(() => {
    const list = shots ?? [];
    return {
      shots: list.length,
      frames: list.filter((s) => s.image_url).length,
      runtime: list.reduce((sum, s) => sum + (s.duration || 0), 0),
    };
  }, [shots]);

  const generateShot = async (shot: Shot) => {
    if (!shot.description.trim()) {
      toast.error("Add a description before generating this shot.");
      return;
    }
    generateShotImage.mutate(shot, {
      onError: (err) => toast.error((err as Error).message),
    });
  };

  const generateAll = async () => {
    const pending = (shots ?? []).filter((s) => s.description.trim() && !s.image_url);
    if (pending.length === 0) {
      toast.info("Every shot with a description already has a frame.");
      return;
    }
    setGeneratingAll(true);
    toast.message(`Generating ${pending.length} frame${pending.length > 1 ? "s" : ""}…`);
    for (const shot of pending) {
      await generateShotImage.mutateAsync(shot).catch((err) => toast.error((err as Error).message));
    }
    setGeneratingAll(false);
    toast.success("Storyboard generated.");
  };

  const openNewShot = () => setDialog({ open: true, shot: null });
  const openEditShot = (shot: Shot) => setDialog({ open: true, shot });

  const handleDialogSubmit = (fields: ShotFields, generate: boolean) => {
    if (dialog.shot) {
      const id = dialog.shot.id;
      updateShot.mutate(
        { id, fields },
        {
          onSuccess: (updated) => {
            if (generate) void generateShot(updated);
          },
          onError: (err) => toast.error((err as Error).message),
        },
      );
    } else {
      createShot.mutate(fields, {
        onSuccess: (created) => {
          if (generate) void generateShot(created);
        },
        onError: (err) => toast.error((err as Error).message),
      });
    }
  };

  const handleDeleteShot = (shot: Shot) => {
    if (!confirm("Delete this shot?")) return;
    deleteShot.mutate(shot.id, { onError: (err) => toast.error((err as Error).message) });
  };

  const commitTitle = () => {
    const next = title.trim() || "Untitled Sequence";
    if (sequence && next !== sequence.title) {
      updateSequence.mutate({ id: sequence.id, fields: { title: next } });
    }
  };

  const commitDescription = () => {
    if (sequence && description !== (sequence.description ?? "")) {
      updateSequence.mutate({ id: sequence.id, fields: { description: description || null } });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Sequences
        </Link>

        {sequenceLoading ? (
          <Skeleton className="h-9 w-64" />
        ) : (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            aria-label="Sequence title"
            className="h-auto border-transparent bg-transparent px-0 font-display text-3xl font-bold tracking-wide shadow-none focus-visible:border-input focus-visible:bg-background focus-visible:px-2 dark:bg-transparent md:text-4xl"
          />
        )}

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={commitDescription}
          placeholder="Add a logline or synopsis to steer the visual tone of every generated frame…"
          aria-label="Sequence logline"
          className="mt-1 min-h-0 resize-none border-transparent bg-transparent px-0 text-sm leading-relaxed text-muted-foreground shadow-none focus-visible:border-input focus-visible:bg-background focus-visible:px-2 dark:bg-transparent"
          rows={2}
        />

        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clapperboard className="size-3.5" /> {stats.shots} shots
          </span>
          <span className="flex items-center gap-1.5">
            <Wand2 className="size-3.5" /> {stats.frames}/{stats.shots} frames
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> {stats.runtime}s runtime
          </span>
          <Button size="sm" onClick={generateAll} disabled={generatingAll} className="ml-auto">
            {generatingAll ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            Generate all
          </Button>
        </div>
      </div>

      {shotsLoading && <Skeleton className="h-64 w-full rounded-xl" />}
      {isError && <p className="text-sm text-destructive">{(error as Error).message}</p>}

      {shots && (
        <StoryboardBoard
          sequenceId={sequenceId}
          shots={shots}
          onAddShot={openNewShot}
          onGenerate={generateShot}
          onEdit={openEditShot}
          onDelete={handleDeleteShot}
        />
      )}

      <ShotDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        shot={dialog.shot}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
