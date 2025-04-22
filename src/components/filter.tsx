import { useState } from "react";
import chevronDown from "@ingka/ssr-icon/paths/chevron-down";
import chevronUp from "@ingka/ssr-icon/paths/chevron-up";
import ListView, { ListViewItem } from "@ingka/list-view";
import Pill from "@ingka/pill";
import Modal, { ModalBody, ModalHeader, Sheets } from "@ingka/modal";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useFilters } from "@/hooks/use-filters";
import { useIsMobile } from "@/hooks/use-is-mobile";

export function Filter({ name, values }: { name: string; values: string[] }) {
  const [open, setOpen] = useState(false);
  const { getSelectedFilters, toggleFilter } = useFilters();
  const isMobile = useIsMobile(56.25);

  const pill = (
    <Pill
      size="small"
      label={name}
      aria-label={`Filter by ${name}`}
      trailingIcon={open ? chevronUp : chevronDown}
      aria-expanded={open}
      selected={open || !!getSelectedFilters(name).length}
      onClick={() => setOpen(!open)}
      className="filter"
    />
  );

  const filterOptions = (
    <ListView id={`${name}-filter-options`} size="small" showDivider={false}>
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
              {filterOptions}
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
        aria-label={`${name} filter options`}
      >
        {filterOptions}
      </PopoverContent>
    </Popover>
  );
}
