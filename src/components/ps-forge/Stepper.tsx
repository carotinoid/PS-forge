
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
      <ol role="list" className="flex items-center justify-around w-full">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              "relative flex-shrink-0", // Let items shrink if needed, but try to give them space via justify-around
              stepIdx !== steps.length - 1 ? "pr-5 sm:pr-10 md:pr-16" : "" // Adjusted padding for connector lines
            )}
          >
            {step.id < currentStep ? (
              <>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className="absolute inset-0 left-1/2 top-[15px] flex items-center" // Position line from center of current to next
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-primary transform -translate-y-1/2" />
                  </div>
                )}
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.id === currentStep ? (
              <>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className="absolute inset-0 left-1/2 top-[15px] flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-gray-200 transform -translate-y-1/2" />
                  </div>
                )}
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-primary"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 && (
                   <div
                    className="absolute inset-0 left-1/2 top-[15px] flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-gray-200 transform -translate-y-1/2" />
                  </div>
                )}
                <div
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-background hover:border-gray-400"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}
            <p className={cn(
                "absolute pt-2 text-xs text-center -translate-x-1/2 left-1/2 whitespace-nowrap", 
                step.id <= currentStep ? "font-medium text-primary" : "text-muted-foreground"
              )}
            >
              {step.name}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
}
