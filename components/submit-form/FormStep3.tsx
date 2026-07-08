import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { projectStatusOptions, projectTypeOptions, sdgGoals, techStackOptions } from "@/lib/types/mapping";
import { ProjectSubmissionSchema } from "@/validations/submit_project";
import { ProjectDomainEnum } from "@/types/prisma-types";
import { useFormContext } from "react-hook-form";
import { MultiSelect } from "../ui/Multi-Select";
import { FormStepIntro } from "./FormStepIntro";


// Create domain options directly from the enum
const projectDomainOptions = Object.values(ProjectDomainEnum).map(domain => {
  // Format the domain name for display (e.g., AI_ML -> AI/ML)
  const label = domain.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    value: domain,
    label: label
  };
});

const FormStep3 = () => {
  const { control, watch } = useFormContext<ProjectSubmissionSchema>();

  // Watch the current values to maintain state
  const projectTypes = watch("projectTypes");
  const techStack = watch("techStack");

  return (
    <div className="space-y-8">
      <FormStepIntro
        step="Step 3 — Classification"
        title="How we list your project"
        description="Pick types, tech, domains, status, and optional SDGs so the right people can discover your work."
      />

      {/* Project Type & Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Project Type Dropdown */}
        <FormField
          control={control}
          name="projectTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type<span className="text-red-500">*</span></FormLabel>
              <MultiSelect
                options={projectTypeOptions}
                onValueChange={(values) => field.onChange(values)}
                defaultValue={field.value || []}
                value={field.value || []}
                placeholder='Select Project Type'
                popoverClass='w-96'
                maxCount={3}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tech Stack Dropdown */}
        <FormField
          control={control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech Stack<span className="text-red-500">*</span></FormLabel>
              <MultiSelect
                options={techStackOptions}
                onValueChange={(values) => field.onChange(values)}
                defaultValue={field.value || []}
                value={field.value || []}
                placeholder='Select Tech Stack'
                popoverClass='w-96'
                maxCount={3}
              />
              <FormMessage />
            </FormItem>
          )}
        />

      </div>

      {/* Project Domains */}
      <FormField
        control={control}
        name="domains"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Domains<span className="text-red-500">*</span></FormLabel>
            <FormDescription className="mb-2">
              Select the domains your project belongs to
            </FormDescription>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {projectDomainOptions.map((domain) => {
                const isSelected = field.value?.includes(domain.value);

                return (
                  <div
                    key={domain.value}
                    className={cn(
                      "flex cursor-pointer flex-col items-center rounded-xl border p-3 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                        : "border-border bg-muted/20 hover:border-primary/40"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      const updatedValue = isSelected
                        ? field.value?.filter((value) => value !== domain.value) || []
                        : [...(field.value || []), domain.value];
                      field.onChange(updatedValue);
                    }}
                  >
                    <div className="text-center text-sm font-medium text-foreground">{domain.label}</div>
                  </div>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Project Status */}
      <FormField
        control={control}
        name="status.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Status<span className="text-red-500">*</span></FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {projectStatusOptions.map((status) => {
                const isSelected = field.value === status.value;

                return (
                  <div
                    key={status.value}
                    className={cn(
                      "flex cursor-pointer flex-col items-center rounded-xl border p-4 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                        : "border-border bg-muted/20 hover:border-primary/40"
                    )}
                    onClick={() => field.onChange(status.value)}
                  >
                    <div className="text-center text-lg font-medium text-foreground">
                      {status.label}
                    </div>
                    <p className="mt-1 text-center text-sm text-muted-foreground">
                      {status.description || ""}
                    </p>
                  </div>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SDG Goals */}
      <FormField
        control={control}
        name="sdgGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>UN Sustainable Development Goals</FormLabel>
            <FormDescription className="mb-2">
              Which SDGs does your project address? (Optional)
            </FormDescription>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {sdgGoals.map((goal) => {
                const isSelected = field.value?.includes(goal.name);

                return (
                  <div
                    key={goal.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-2 py-2 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                        : "border-border bg-muted/20 hover:border-primary/40"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      const updatedValue = isSelected
                        ? field.value?.filter((name) => name !== goal.name) || []
                        : [...(field.value || []), goal.name];
                      field.onChange(updatedValue);
                    }}
                  >
                    <div className="flex-shrink-0 h-20 w-20">
                      <img
                        src={goal.icon}
                        alt={goal.name}
                        className="h-full w-full object-contain rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="max-h-[3.75rem] flex-1 min-w-0 overflow-y-auto pr-1 text-xs leading-tight text-muted-foreground scroll-hide">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />



    </div>
  );
};

export default FormStep3;