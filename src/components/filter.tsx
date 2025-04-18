import { useState } from "react";
import chevronDown from "@ingka/ssr-icon/paths/chevron-down";
import chevronUp from "@ingka/ssr-icon/paths/chevron-up";
import ListView, { ListViewItem } from "@ingka/list-view";
import Pill from "@ingka/pill";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useFilters } from "@/hooks/use-filters";

export function Filter({ name, values }: { name: string; values: string[] }) {
  const [open, setOpen] = useState(false);
  const { getSelectedFilters, toggleFilter } = useFilters();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Pill
          size="small"
          label={name}
          trailingIcon={open ? chevronUp : chevronDown}
          aria-expanded={open}
          selected={open || !!getSelectedFilters(name).length}
          onClick={() => setOpen(!open)}
          className="filter"
        />
      </PopoverTrigger>
      <PopoverContent className="filter__dropdown">
        <ListView
          id={`${name}-filter-options`}
          size="small"
          showDivider={false}
        >
          {values.map((value) => (
            <ListViewItem
              control="checkbox"
              controlProps={{
                value: value,
                defaultChecked: getSelectedFilters(name).includes(value),
              }}
              key={value}
              onChange={() => toggleFilter({ name, filter: value })}
              title={value}
            />
          ))}
        </ListView>
      </PopoverContent>
    </Popover>
  );
}
