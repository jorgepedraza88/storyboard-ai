import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Shot } from "@/types/database";
import { labelFor } from "@/lib/shot-options";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GripVertical,
  Sparkles,
  RefreshCw,
  Pencil,
  Trash2,
  Loader2,
  Clock,
  TriangleAlert,
  ImageIcon,
  Target,
  MessageSquareQuote,
} from "lucide-react";

export interface ShotCardHandlers {
  onGenerate: (shot: Shot) => void;
  onEdit: (shot: Shot) => void;
  onDelete: (shot: Shot) => void;
}

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-border/70 bg-background/40 px-2 py-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
    >
      {children}
    </Badge>
  );
}

function Frame({ shot }: { shot: Shot }) {
  if (shot.status === "generating") {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-muted/50 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs uppercase tracking-widest">Sketching…</span>
      </div>
    );
  }

  if (shot.image_url) {
    return (
      <img
        src={shot.image_url}
        alt={`Storyboard frame: ${shot.title || shot.description}`}
        className="aspect-video w-full bg-muted object-cover"
        draggable={false}
      />
    );
  }

  if (shot.status === "error") {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 bg-muted/40 text-muted-foreground">
        <TriangleAlert className="size-5 text-destructive" />
        <span className="text-xs">Generation failed</span>
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 bg-muted/40 text-muted-foreground">
      <ImageIcon className="size-6 opacity-60" />
      <span className="text-xs uppercase tracking-widest">No frame yet</span>
    </div>
  );
}

interface ShotCardViewProps extends ShotCardHandlers {
  shot: Shot;
  index: number;
  dragHandle?: React.ReactNode;
  isOverlay?: boolean;
  isDragging?: boolean;
}

export function ShotCardView({
  shot,
  index,
  dragHandle,
  isOverlay,
  isDragging,
  onGenerate,
  onEdit,
  onDelete,
}: ShotCardViewProps) {
  const busy = shot.status === "generating";
  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors",
        isOverlay && "rotate-2 shadow-xl ring-1 ring-primary/40",
        isDragging && "opacity-40",
      )}
    >
      <div className="relative">
        <Frame shot={shot} />
        <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1.5">
          <span className="rounded-md bg-background/80 px-1.5 py-0.5 font-display text-xs font-semibold tracking-widest text-foreground backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {dragHandle && <div className="absolute right-2 top-2">{dragHandle}</div>}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex flex-col gap-1">
          <h4 className="font-display text-sm font-semibold leading-tight tracking-wide text-foreground text-pretty">
            {shot.title || "Untitled Shot"}
          </h4>
          {shot.description ? (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {shot.description}
            </p>
          ) : null}
        </div>

        {(shot.purpose || shot.dialogue) && (
          <div className="flex flex-col gap-1 border-l-2 border-border/70 pl-2">
            {shot.purpose ? (
              <p className="flex items-start gap-1 text-xs text-muted-foreground">
                <Target className="mt-0.5 size-3 shrink-0 opacity-70" />
                <span className="line-clamp-1">{shot.purpose}</span>
              </p>
            ) : null}
            {shot.dialogue ? (
              <p className="flex items-start gap-1 text-xs italic text-muted-foreground">
                <MessageSquareQuote className="mt-0.5 size-3 shrink-0 opacity-70" />
                <span className="line-clamp-2">{shot.dialogue}</span>
              </p>
            ) : null}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          <MetaBadge>{labelFor("shotType", shot.camera_shot_type)}</MetaBadge>
          <MetaBadge>{labelFor("cameraAngle", shot.camera_angle)}</MetaBadge>
          <MetaBadge>{labelFor("cameraMovement", shot.camera_movement)}</MetaBadge>
          <MetaBadge>{labelFor("lens", shot.lens)}</MetaBadge>
          <MetaBadge>
            <Clock className="mr-0.5 inline size-2.5 -translate-y-px" />
            {shot.duration}s
          </MetaBadge>
        </div>

        {shot.status === "error" && shot.error_message && (
          <p className="text-xs text-destructive">{shot.error_message}</p>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <Button
            size="sm"
            variant={shot.image_url ? "secondary" : "default"}
            className="flex-1"
            disabled={busy}
            onClick={() => onGenerate(shot)}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : shot.image_url ? (
              <RefreshCw className="size-4" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {shot.image_url ? "Regenerate" : "Generate"}
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Edit shot" onClick={() => onEdit(shot)}>
            <Pencil className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Delete shot"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(shot)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SortableShotCard({
  shot,
  index,
  ...handlers
}: { shot: Shot; index: number } & ShotCardHandlers) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: shot.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const dragHandle = (
    <button
      type="button"
      className="flex size-7 cursor-grab touch-none items-center justify-center rounded-md bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 active:cursor-grabbing"
      aria-label="Drag to reorder shot"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <ShotCardView shot={shot} index={index} dragHandle={dragHandle} isDragging={isDragging} {...handlers} />
    </div>
  );
}
