import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function Wizard({
  title = 'Wizard',
  steps = [],
  onComplete = () => {},
  onStepChange = () => {},
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      onStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onStepChange(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>

      {/* Step Content */}
      <div className="mb-6">{step.content}</div>

      {/* Buttons */}
      <div className="flex gap-4 justify-between">
        <Button
          variant="secondary"
          size="md"
          onClick={handlePrev}
          disabled={isFirstStep}
        >
          Previous
        </Button>

        {!isLastStep ? (
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={handleComplete}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}
