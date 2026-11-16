import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import type { Shot } from "@/types/database";
import { SortableShotCard, ShotCardView, type ShotCardHandlers } from "@/components/storyboard/ShotCard";
import { useReorderShots } from "@/hooks/useReorderShots";
import { Button } from "@/components/ui/button";
import { Clapperboard, Plus } from "lucide-react";

const POSITION_STEP = 1000;

interface StoryboardBoardProps extends ShotCardHandlers {
  sequenceId: string;
  shots: Shot[];
  onAddShot: () => void;
}

export function StoryboardBoard({ sequenceId, shots, onAddShot, ...handlers }: StoryboardBoardProps) {
  const reorderShots = useReorderShots(sequenceId);
  const [items, setItems] = useState<Shot[]>(shots);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isDragging.current) setItems(shots);
  }, [shots]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart(event: { active: { id: string | number } }) {
    isDragging.current = true;
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    isDragging.current = false;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((s) => s.id === active.id);
    const newIndex = items.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);

    const before = next[newIndex - 1];
    const after = next[newIndex + 1];
    let position: number;
    if (before && after) {
      position = (before.position + after.position) / 2;
    } else if (before) {
      position = before.position + POSITION_STEP;
    } else if (after) {
      position = after.position - POSITION_STEP;
    } else {
      position = POSITION_STEP;
    }

    reorderShots.mutate({ id: active.id as string, position });
  }

  function handleDragCancel() {
    isDragging.current = false;
    setActiveId(null);
    setItems(shots);
  }

  const total = items.reduce((sum, s) => sum + (s.duration || 0), 0);
  const activeShot = activeId ? items.find((s) => s.id === activeId) : undefined;
  const activeIndex = activeShot ? items.findIndex((s) => s.id === activeShot.id) : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {items.length} {items.length === 1 ? "shot" : "shots"} · {total}s runtime
        </p>
        <Button size="sm" variant="outline" onClick={onAddShot}>
          <Plus className="size-4" />
          Shot
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border py-10 text-center text-muted-foreground">
          <Clapperboard className="size-5 opacity-60" />
          <p className="text-sm">No shots yet</p>
          <p className="text-xs">Add a shot to start storyboarding.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={items.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((shot, index) => (
                <SortableShotCard key={shot.id} shot={shot} index={index} {...handlers} />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeShot ? (
              <div className="w-[min(320px,80vw)]">
                <ShotCardView shot={activeShot} index={activeIndex} isOverlay {...handlers} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
