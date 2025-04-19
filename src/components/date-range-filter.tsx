import { useSearchParams } from "next/navigation";
import { DateFilter } from "./date-filter";

export function DateRangeFilter() {
  const searchParams = useSearchParams();
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const selectedStyles = fromDate || toDate ? " selected" : "";

  return (
    <div className={`date-range${selectedStyles}`}>
      <DateFilter name="from" />
      <DateFilter name="to" limit={fromDate ?? undefined} />
    </div>
  );
}
