interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative mb-10 space-y-4">
      <div className="absolute -left-4 top-0 h-full w-1 rounded-r-full bg-gradient-to-b from-primary via-primary/50 to-transparent shadow-[0_0_15px_rgba(255,100,0,0.5)]" />
      <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,100,0,1)] animate-pulse" />
        Alpha GYM OS
      </span>
      <h1 className="text-4xl font-extrabold tracking-tight font-[family-name:var(--font-barlow-condensed)] sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 drop-shadow-sm">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-base sm:text-lg text-foreground/60 font-medium">
          {description}
        </p>
      )}
      <div className="h-[2px] w-full max-w-2xl bg-gradient-to-r from-primary/50 via-primary/10 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-white/50 blur-[1px] transform -translate-x-full animate-[shimmer_3s_infinite]" />
      </div>
    </div>
  );
}
