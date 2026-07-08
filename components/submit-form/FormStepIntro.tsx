// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

interface FormStepIntroProps {
  step: string;
  title: string;
  description?: string;
}

export function FormStepIntro({ step, title, description }: FormStepIntroProps) {
  return (
    <div className="mb-6 space-y-2 border-b border-border/60 pb-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
        {step}
      </p>
      <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
