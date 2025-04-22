import Text from "@ingka/text";
import { ErrorBoundary } from "react-error-boundary";

import { Product, Region, useGetForecast } from "@/hooks/use-get-forecast";
import { Filter } from "./filter";
import { ForecastTable } from "./forecast-table";
import { DateRangeFilter } from "./date-range-filter";
import { DemandOverTimeChart } from "./charts";
import { ErrorMessage } from "./error-message";
import { Fallback } from "./fallback";

export function Dashboard() {
  const { data, error, refetch } = useGetForecast();
  return (
    <div className="dashboard__container">
      <header>
        <Text textStyle="Heading.L" className="title" tagName="h1">
          Demand forecast
        </Text>
      </header>
      <div className="dashboard__filter-bar">
        <Filter name="region" values={Object.values(Region)} />
        <Filter name="product" values={Object.values(Product)} />
        <DateRangeFilter />
      </div>
      <main className="dashboard__content">
        {error ? (
          <ErrorMessage message={error.message} onClick={refetch} />
        ) : (
          <>
            <ErrorBoundary fallbackRender={Fallback}>
              <ForecastTable data={data} className="dashboard__table" />
            </ErrorBoundary>
            <ErrorBoundary fallbackRender={Fallback}>
              <DemandOverTimeChart data={data} className="dashboard__charts" />
            </ErrorBoundary>
          </>
        )}
      </main>
    </div>
  );
}
