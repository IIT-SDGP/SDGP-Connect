// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FormStepperProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { label: "Basics", hint: "Identity & media" },
  { label: "Details", hint: "Story & gallery" },
  { label: "Tags", hint: "Type & SDGs" },
  { label: "Contact", hint: "Reach & socials" },
  { label: "Team", hint: "People" },
] as const;

const FormStepper = ({ currentStep, totalSteps }: FormStepperProps) => {
  const steps = STEPS.slice(0, totalSteps);

  return (
    <div className="mb-8">
      {/* Desktop: equal flex columns so each label stacks under its step circle */}
      <div className="relative hidden md:block">
        <div
          className="pointer-events-none absolute left-[10%] right-[10%] top-[1.125rem] z-0 h-0.5 bg-border"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-[10%] top-[1.125rem] z-0 h-0.5 rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{
            width:
              totalSteps <= 1
                ? "0%"
                : `${(Math.max(0, currentStep - 1) / (totalSteps - 1)) * 80}%`,
          }}
          aria-hidden
        />
        <div className="relative z-[1] flex w-full">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isDone = currentStep > stepNumber;

            return (
              <div
                key={step.label}
                className="flex min-w-0 flex-1 flex-col items-center"
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-semibold transition-all",
                    isActive &&
                      "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25",
                    isDone && !isActive && "border-primary bg-primary text-primary-foreground",
                    !isActive && !isDone && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="mt-3 w-full min-w-0 px-1 text-center sm:px-1.5">
                  <p
                    className={cn(
                      "text-xs font-medium leading-tight",
                      isActive || isDone ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground line-clamp-2">
                    {step.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="truncate text-sm font-semibold text-foreground">
            {STEPS[currentStep - 1]?.label}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
          {STEPS[currentStep - 1]?.hint}
        </p>
      </div>
    </div>
  );
};

export default FormStepper;
