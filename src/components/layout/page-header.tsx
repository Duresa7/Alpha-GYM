interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-barlow-condensed)]">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
