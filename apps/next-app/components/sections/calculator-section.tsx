import type { CalculatorBlock } from "@kruze-poc/sanity-schemas/src/types";

interface CalculatorSectionProps {
  section: CalculatorBlock;
}

const calculatorLabels: Record<string, string> = {
  "rd": "R&D Tax Credit Calculator",
  "delaware": "Delaware Franchise Tax Calculator",
  "vropd": "VROPD Calculator",
  "tax-return": "Tax Return Calculator",
  "ceo-salary": "CEO Salary Calculator",
  "cash-burn": "Cash Burn Calculator",
};

export function CalculatorSection({ section }: CalculatorSectionProps) {
  const label = calculatorLabels[section.calculatorType] ?? section.calculatorType;

  return (
    <section className="py-16 px-6 bg-subtle">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs text-dim mb-4">calculatorBlock</p>
        <div className="rounded-md border border-rule p-8 text-center bg-base">
          <p className="text-xl font-bold text-primary">{label}</p>
          <p className="text-sm text-dim mt-2">Calculator embed: <code>{section.calculatorType}</code></p>
        </div>
      </div>
    </section>
  );
}
