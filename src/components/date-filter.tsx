import chevronDown from "@ingka/ssr-icon/paths/chevron-down";
import chevronUp from "@ingka/ssr-icon/paths/chevron-up";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import Pill from "@ingka/pill";
import { useFilters } from "@/hooks/use-filters";
import { useRouter } from "next/router";

export const formatToString = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

function getLabel(date?: Date, defaultValue?: string) {
  if (date) {
    return format(date, "dd MMM");
  }
  return defaultValue ?? "Date";
}

export function DateFilter({ name, limit }: { name: string; limit?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [selected, setSelected] = useState<Date | undefined>();
  const { clearFilter, setFilter } = useFilters();

  useEffect(() => {
    if (router.isReady) {
      const value = router.query[name];

      if (value) {
        if (typeof value === "string") {
          setSelected(new Date(value));
        }
      }
    }
  }, [router.isReady]);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);

    if (date) {
      setFilter({
        name,
        filter: formatToString(date),
      });
    } else {
      clearFilter(name);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Pill
          size="small"
          label={getLabel(selected, name)}
          trailingIcon={open ? chevronUp : chevronDown}
          aria-expanded={open}
          className="filter"
        />
      </PopoverTrigger>
      <PopoverContent className="filter__dropdown" aria-label="Date picker">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={limit ? { before: new Date(limit) } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
