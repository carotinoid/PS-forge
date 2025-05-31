
"use client";

import { cn } from "@/lib/utils";
import type { AppStep } from "@/types";

interface StepperProps {
  currentStep: AppStep;
  steps: { id: AppStep; name: string }[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-start justify-between w-full">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              "relative flex-1 flex flex-col items-center", // flex-1 to distribute space
              stepIdx !== steps.length - 1 ? "pr-4" : "" // Minimal padding for line end
            )}
          >
            <div className="flex flex-col items-center"> {/* Wrapper for circle and text */}
              {step.id < currentStep ? (
                // Completed Step
                <>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className="absolute left-1/2 top-4 h-0.5 w-full bg-primary translate-x-0" // Line starts from center of current, extends full width of li's flex space
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                </>
              ) : step.id === currentStep ? (
                // Current Step
                <>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className="absolute left-1/2 top-4 h-0.5 w-full bg-gray-200 translate-x-0"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-primary z-10"
                    aria-current="step"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                </>
              ) : (
                // Future Step
                <>
                  {stepIdx !== steps.length - 1 && (
                     <div
                      className="absolute left-1/2 top-4 h-0.5 w-full bg-gray-200 translate-x-0"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-background hover:border-gray-400 z-10"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                      aria-hidden="true"
                    />
                  </div>
                </>
              )}
              <p className={cn(
                  "mt-2 text-xs text-center w-28 break-words", // Increased top margin, fixed width, allow word break
                  step.id <= currentStep ? "font-medium text-primary" : "text-muted-foreground"
                )}
              >
                {step.name}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

