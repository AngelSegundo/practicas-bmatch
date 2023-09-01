import React from "react";
import { FunctionComponent } from "react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";

export type Status = "complete" | "current" | "upcoming";

export type BaseSteps = Array<{
  number: string;
  name: string;
  status: Status;
}>;

interface BulletsStepProps {
  steps: BaseSteps;
  onClick: ((stepIndex: number) => void) | null;
}

// fixme: crear tests
const BulletsStep: FunctionComponent<BulletsStepProps> = ({
  steps,
  onClick,
}) => {
  return (
    <div className="flex m-6">
      <nav className="flex justify-center" aria-label="Progress">
        <ol role="list" className="space-y-6">
          {steps.map((step) => (
            <li key={step.name}>
              {step.status === "complete" ? (
                <span className="flex flex-row items-start">
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <CheckCircleIcon
                      className="h-full w-full text-blue-600 group-hover:text-blue-800"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                    {step.name}
                  </span>
                </span>
              ) : step.status === "current" ? (
                <div className="flex items-start">
                  <span
                    className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="absolute h-4 w-4 rounded-full bg-blue-200" />
                    <span className="relative block h-2 w-2 rounded-full bg-blue-600" />
                  </span>
                  <p className="ml-3 text-sm font-medium text-blue-600 group-hover:text-gray-900">
                    {step.name}
                  </p>
                </div>
              ) : (
                <div className="flex items-start">
                  <div
                    className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                  </div>
                  <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                    {step.name}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default BulletsStep;
