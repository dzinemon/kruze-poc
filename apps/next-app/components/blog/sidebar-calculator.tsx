export function SidebarCalculator() {
  return (
    <div className="rounded-md bg-subtle border border-divider p-5">
      <h3 className="text-lg font-bold text-primary mb-4">
        How Much Tax Return Costs
      </h3>
      <form className="space-y-4">
        <div>
          <label htmlFor="revenue" className="block text-sm font-bold text-secondary mb-1.5">
            Annual Revenue
          </label>
          <input
            type="text"
            id="revenue"
            placeholder="e.g. $500,000"
            className="w-full py-[9px] px-4 text-sm leading-5 text-primary bg-base border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
          />
        </div>
        <div>
          <label htmlFor="employees" className="block text-sm font-bold text-secondary mb-1.5">
            Number of Employees
          </label>
          <input
            type="text"
            id="employees"
            placeholder="e.g. 10"
            className="w-full py-[9px] px-4 text-sm leading-5 text-primary bg-base border border-rule rounded-sm placeholder:text-dim focus:outline-none focus:border-brand-500 focus:shadow-focus-ring transition-fast"
          />
        </div>
        <button
          type="button"
          className="w-full py-2.5 px-5 text-sm font-bold text-white rounded-sm bg-brand-500 hover:bg-brand-600 shadow-sm hover:shadow-brand transition-fast focus-ring"
        >
          Calculate
        </button>
      </form>
    </div>
  );
}
