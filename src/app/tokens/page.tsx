import { Activity, Dumbbell, Save } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TokensPage() {
  return (
    <div>
      <PageHeader
        title="Design Tokens"
        description="Flat control, card, input, and status samples for Alpha GYM."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="app-surface">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl">
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="flex flex-wrap gap-3">
              <Button>
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline">
                <Dumbbell className="h-4 w-4" />
                Outline
              </Button>
              <Button variant="secondary">
                <Activity className="h-4 w-4" />
                Secondary
              </Button>
            </div>
            <Input placeholder="Flat input" />
            <div className="flex flex-wrap gap-2">
              <Badge>Primary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="app-surface">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="font-[family-name:var(--font-barlow-condensed)] text-xl">
              Surfaces
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 pt-5 sm:grid-cols-2">
            {[
              ["Primary", "border-primary/45 bg-primary/10 text-primary"],
              ["Accent", "border-cyan-500/35 bg-cyan-500/10 text-cyan-300"],
              ["Success", "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"],
              ["Warning", "border-amber-500/35 bg-amber-500/10 text-amber-300"],
            ].map(([label, className]) => (
              <div key={label} className={`rounded-md border p-4 ${className}`}>
                <p className="font-semibold">{label}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dense, readable, solid surface.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
