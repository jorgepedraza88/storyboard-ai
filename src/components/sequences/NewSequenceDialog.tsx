import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSequence } from "@/hooks/useSequences";
import { PlusIcon } from "lucide-react";

export function NewSequenceDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createSequence = useCreateSequence();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createSequence.mutate(
      { title: title.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setDescription("");
        },
        onError: (err) => toast.error((err as Error).message),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon />
        New sequence
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New sequence</DialogTitle>
            <DialogDescription>
              A sequence groups the shots of one scene in your storyboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Input
              autoFocus
              placeholder="Sequence title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!title.trim() || createSequence.isPending}>
              {createSequence.isPending ? "Creating…" : "Create sequence"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
