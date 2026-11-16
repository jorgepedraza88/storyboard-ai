import { useEffect, useState } from "react";
import type { Shot } from "@/types/database";
import type { ShotFields } from "@/services/shots";
import { SHOT_TYPES, CAMERA_ANGLES, CAMERA_MOVEMENTS, LENSES, DEFAULTS, type Option } from "@/lib/shot-options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

interface ShotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The shot being edited, or null when creating a new one */
  shot: Shot | null;
  onSubmit: (fields: ShotFields, generate: boolean) => void;
}

const DEFAULT_FIELDS: ShotFields = {
  title: "",
  description: "",
  camera_shot_type: DEFAULTS.shotType,
  camera_angle: DEFAULTS.cameraAngle,
  camera_movement: DEFAULTS.cameraMovement,
  lens: DEFAULTS.lens,
  duration: 4,
  dialogue: "",
  purpose: "",
};

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={(v) => v && onChange(v as string)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ShotDialog({ open, onOpenChange, shot, onSubmit }: ShotDialogProps) {
  const [fields, setFields] = useState<ShotFields>(DEFAULT_FIELDS);

  useEffect(() => {
    if (open) {
      setFields(
        shot
          ? {
              title: shot.title,
              description: shot.description,
              camera_shot_type: shot.camera_shot_type ?? DEFAULTS.shotType,
              camera_angle: shot.camera_angle ?? DEFAULTS.cameraAngle,
              camera_movement: shot.camera_movement ?? DEFAULTS.cameraMovement,
              lens: shot.lens ?? DEFAULTS.lens,
              duration: shot.duration,
              dialogue: shot.dialogue ?? "",
              purpose: shot.purpose ?? "",
            }
          : DEFAULT_FIELDS,
      );
    }
  }, [open, shot]);

  function set<K extends keyof ShotFields>(key: K, value: ShotFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(generate: boolean) {
    const title = fields.title.trim() || "Untitled Shot";
    onSubmit(
      {
        ...fields,
        title,
        dialogue: fields.dialogue?.trim() || null,
        purpose: fields.purpose?.trim() || null,
      },
      generate,
    );
    onOpenChange(false);
  }

  const canGenerate = fields.description.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="p-5 pb-3">
          <DialogTitle className="font-display text-xl font-semibold tracking-wide">
            {shot ? "Edit Shot" : "New Shot"}
          </DialogTitle>
          <DialogDescription>
            Describe the moment and dial in the camera language. The AI turns it into a black &amp; white
            storyboard frame.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5 pb-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shot-title" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Title
            </Label>
            <Input
              id="shot-title"
              value={fields.title}
              placeholder="e.g. Hero enters the frame"
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shot-desc" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="shot-desc"
              value={fields.description}
              placeholder="What happens in this shot? Describe the action, subject, setting, mood and lighting."
              className="min-h-24 resize-none"
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Notes only — not used in the image prompt
            </p>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="shot-purpose"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Purpose / Goal
              </Label>
              <Input
                id="shot-purpose"
                value={fields.purpose ?? ""}
                placeholder="What is this shot meant to accomplish in the story?"
                onChange={(e) => set("purpose", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="shot-dialogue"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Dialogue
              </Label>
              <Textarea
                id="shot-dialogue"
                value={fields.dialogue ?? ""}
                placeholder="Lines spoken during this shot…"
                className="min-h-16 resize-none"
                onChange={(e) => set("dialogue", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldSelect
              label="Shot Type"
              value={fields.camera_shot_type ?? DEFAULTS.shotType}
              options={SHOT_TYPES}
              onChange={(v) => set("camera_shot_type", v)}
            />
            <FieldSelect
              label="Angle"
              value={fields.camera_angle ?? DEFAULTS.cameraAngle}
              options={CAMERA_ANGLES}
              onChange={(v) => set("camera_angle", v)}
            />
            <FieldSelect
              label="Movement"
              value={fields.camera_movement ?? DEFAULTS.cameraMovement}
              options={CAMERA_MOVEMENTS}
              onChange={(v) => set("camera_movement", v)}
            />
            <FieldSelect
              label="Lens"
              value={fields.lens ?? DEFAULTS.lens}
              options={LENSES}
              onChange={(v) => set("lens", v)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shot-duration" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Duration (seconds)
            </Label>
            <Input
              id="shot-duration"
              type="number"
              min={1}
              max={600}
              value={fields.duration}
              className="w-28"
              onChange={(e) => set("duration", Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => handleSubmit(false)}>
            Save
          </Button>
          <Button onClick={() => handleSubmit(true)} disabled={!canGenerate}>
            <Sparkles className="size-4" />
            Save &amp; Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
