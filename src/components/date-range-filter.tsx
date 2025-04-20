import { useSearchParams } from "next/navigation";
import { DateFilter } from "./date-filter";

export function DateRangeFilter() {
  const searchParams = useSearchParams();
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const className = "date-range";
  const selectedStyles = fromDate || toDate ? ` ${className}--selected` : "";

  return (
    <div className={`${className} ${selectedStyles}`}>
      <DateFilter name="from" />
      <DateFilter name="to" limit={fromDate ?? undefined} />
    </div>
  );
}
