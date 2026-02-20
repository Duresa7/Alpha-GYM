interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-2">
      <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
        Alpha GYM
      </span>
      <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-barlow-condensed)] sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      )}
      <div className="h-px w-full max-w-md bg-gradient-to-r from-primary/60 via-primary/15 to-transparent" />
    </div>
  );
}
