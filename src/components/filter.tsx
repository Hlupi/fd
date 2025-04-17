import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import chevronDown from "@ingka/ssr-icon/paths/chevron-down";
import ListView, { ListViewItem } from "@ingka/list-view";
import Pill from "@ingka/pill";

export function Filter({ name, values }: { name: string; values: string[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  console.log("searchParams", searchParams.toString());
  useEffect(() => {
    const closeIfClickOutside = (event: Event) => {
      if (
        open &&
        !dropdownRef.current?.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeIfClickOutside);

    return () => document.removeEventListener("mousedown", closeIfClickOutside);
  }, [dropdownRef, buttonRef, open]);

  const getSelectedFilters = (name: string): string[] => {
    const paramValue = searchParams.get(name);
    return paramValue ? paramValue.split(",") : [];
  };

  const toggleFilter = (filter: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const currentFilters = getSelectedFilters(name);

    // Toggle the filter
    let updatedFilters: string[];
    if (currentFilters.includes(filter)) {
      updatedFilters = currentFilters.filter((f) => f !== filter);
    } else {
      updatedFilters = [...currentFilters, filter];
    }

    // Update or remove the search parameter
    if (updatedFilters.length > 0) {
      newSearchParams.set(name, updatedFilters.join(","));
    } else {
      newSearchParams.delete(name);
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <>
      <Pill
        size="small"
        label={name}
        trailingIcon={chevronDown}
        aria-expanded={open}
        selected={open}
        onClick={() => setOpen(!open)}
        ref={buttonRef}
        className="filter"
      />
      {open && (
        <div ref={dropdownRef} className="filter__dropdown">
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
                onChange={() => toggleFilter(value)}
                title={value}
              />
            ))}
          </ListView>
        </div>
      )}
    </>
  );
}
