import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { brand } from "@/lib/brand";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <Link to="/today" className="font-display text-lg tracking-tight">
            {brand.name}
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              to="/today"
              activeProps={{ className: "text-foreground font-medium" }}
              className="text-muted-foreground hover:text-foreground"
            >
              This week
            </Link>
            <Link
              to="/story"
              activeProps={{ className: "text-foreground font-medium" }}
              className="text-muted-foreground hover:text-foreground"
            >
              My story
            </Link>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
