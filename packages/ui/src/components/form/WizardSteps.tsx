import * as React from "react";

export type WizardStep = {
  key: string;
  label: string;
};

export type WizardStepsProps = {
  steps: WizardStep[];
  currentStep: number;
  compact?: boolean;
  className?: string;
};

export function WizardSteps({
  steps,
  currentStep,
  compact = false,
  className = "",
}: WizardStepsProps) {
  return (
    <ol className={mimo-wizard  .trim()}>
      {steps.map((step, index) => {
        const stepIndex = index + 1;
        const isComplete = stepIndex < currentStep;
        const isCurrent = stepIndex === currentStep;

        return (
          <li
            key={step.key}
            className={mimo-wizard__step  .trim()}
          >
            <span className="mimo-wizard__marker">{isComplete ? "" : stepIndex}</span>
            <span className="mimo-wizard__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
