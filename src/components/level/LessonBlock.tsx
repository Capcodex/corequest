import { Card } from "@/components/ui/Card";
import { LessonSection } from "@/types/level";

type LessonBlockProps = {
  exampleCode: string;
  lessonSections: LessonSection[];
};

export function LessonBlock({ exampleCode, lessonSections }: LessonBlockProps) {
  return (
    <Card className="space-y-6 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Cours</p>
      </div>
      <div className="space-y-5">
        {lessonSections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">{section.heading}</h3>
            <p className="text-sm leading-7 text-muted">{section.content}</p>
          </section>
        ))}
      </div>
      <div className="space-y-3 rounded-3xl border border-border bg-slate-950/60 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Exemple</p>
        <pre className="overflow-x-auto text-sm leading-7 text-slate-200">
          <code>{exampleCode}</code>
        </pre>
      </div>
    </Card>
  );
}
