import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getSelectedFilters = (name: string): string[] => {
    const paramValue = searchParams.get(name);
    return paramValue ? paramValue.split(",") : [];
  };

  const toggleFilter = ({ name, filter }: { name: string; filter: string }) => {
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

  const setFilter = ({ name, filter }: { name: string; filter: string }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (filter) {
      newSearchParams.set(name, filter);
    } else {
      newSearchParams.delete(name);
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const clearFilter = (name: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(name);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return {
    getSelectedFilters,
    toggleFilter,
    setFilter,
    clearFilter,
  };
}
