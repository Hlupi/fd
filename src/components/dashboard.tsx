import Text from "@ingka/text";

import { Product, Region, useForecast } from "@/hooks/use-get-forecast";
import { Filter } from "./filter";
import { ForecastTable } from "./forecast-table";
import { DateRangeFilter } from "./date-range-filter";
import { DemandOverTimeChart } from "./charts";

export function Dashboard() {
  const { data, isLoading, error, refetch } = useForecast();
  return (
    <div className="dashboard__container">
      <Text textStyle="Heading.L" className="title" tagName="h1">
        Demand forecast
      </Text>
      <div className="dashboard__filter-bar">
        <Filter name="region" values={Object.values(Region)} />
        <Filter name="product" values={Object.values(Product)} />
        <DateRangeFilter />
      </div>

      {isLoading ? (
        <div>Loading forecast data...</div>
      ) : error ? (
        <div>
          Error: {error.message} <button onClick={refetch}>Try Again</button>
        </div>
      ) : !data ? (
        <div>No forecast data available.</div>
      ) : (
        <div className="dashboard__content">
          <ForecastTable data={data} className="dashboard__table lol" />
          <DemandOverTimeChart data={data} className="dashboard__charts" />
        </div>
      )}
    </div>
  );
}
