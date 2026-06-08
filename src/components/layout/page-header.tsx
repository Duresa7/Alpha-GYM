interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 border-b border-border pb-5">
      <div className="mb-2 inline-flex rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-semibold uppercase text-primary">
        Alpha GYM
      </div>
      <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-barlow-condensed)] sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
