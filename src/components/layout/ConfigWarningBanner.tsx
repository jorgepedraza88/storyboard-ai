import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isOpenRouterConfigured } from "@/lib/openrouter";
import { TriangleAlertIcon } from "lucide-react";

export function ConfigWarningBanner() {
  if (isSupabaseConfigured && isOpenRouterConfigured) return null;

  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
      <TriangleAlertIcon />
      <AlertTitle>Missing configuration</AlertTitle>
      <AlertDescription>
        {!isSupabaseConfigured && (
          <p>
            Supabase isn't configured. Set <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code>.
          </p>
        )}
        {!isOpenRouterConfigured && (
          <p>
            OpenRouter isn't configured. Set <code>VITE_OPENROUTER_API_KEY</code> in{" "}
            <code>.env.local</code> to enable AI generation.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
