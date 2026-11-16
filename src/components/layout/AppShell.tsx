import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ConfigWarningBanner } from "@/components/layout/ConfigWarningBanner";
import { ClapperboardIcon } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <ConfigWarningBanner />
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ClapperboardIcon className="size-4.5" />
            </span>
            <div className="leading-none">
              <p className="font-display text-lg font-bold tracking-widest text-foreground">
                STORYBOARD STUDIO
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                AI Storyboards
              </p>
            </div>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
      <Toaster position="bottom-center" />
    </div>
  );
}
