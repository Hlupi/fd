import chevronDown from "@ingka/ssr-icon/paths/chevron-down";
import chevronUp from "@ingka/ssr-icon/paths/chevron-up";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import Pill from "@ingka/pill";
import { useRouter } from "next/router";
import Modal, { ModalBody, ModalHeader, Sheets } from "@ingka/modal";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useFilters } from "@/hooks/use-filters";
import { inCypress } from "@/utils/in-cypress";
import { useIsMobile } from "@/hooks/use-is-mobile";

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
  const isMobile = useIsMobile(56.25);

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

  const pill = (
    <Pill
      size="small"
      label={getLabel(selected, name)}
      trailingIcon={open ? chevronUp : chevronDown}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="filter"
    />
  );

  const dayPicker = (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      disabled={limit ? { before: new Date(limit) } : undefined}
      month={inCypress ? new Date(2025, 3) : undefined}
    />
  );

  if (isMobile) {
    return (
      <>
        {pill}
        <Modal visible={open} handleCloseBtn={() => setOpen(false)}>
          <Sheets
            header={
              <ModalHeader
                title={name}
                ariaCloseTxt={`Close ${name} filter options`}
                className="filter"
              />
            }
            footer={null}
          >
            <ModalBody aria-label={`${name} filter options`}>
              {dayPicker}
            </ModalBody>
          </Sheets>
        </Modal>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{pill}</PopoverTrigger>
      <PopoverContent
        className="filter__dropdown"
        aria-label={`${name} date picker`}
      >
        {dayPicker}
      </PopoverContent>
    </Popover>
  );
}
