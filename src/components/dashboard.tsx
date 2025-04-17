import Text from "@ingka/text";

import { Product, Region, useForecast } from "@/hooks/use-get-forecast";
import { Filter } from "./filter";
import { ForecastTable } from "./forecast-table";

export function Dashboard() {
  const { data, isLoading, error, refetch } = useForecast();

  if (isLoading) return <div>Loading forecast data...</div>;
  //TODO: handle error state 500 {error: "An unknown error occurred"}
  if (error)
    return (
      <div>
        Error: {error.message} <button onClick={refetch}>Try Again</button>
      </div>
    );
  if (!data) return <div>No forecast data available.</div>;
  return (
    <div className="dashboard__container">
      <Text textStyle="Heading.L" className="title" tagName="h1">
        Demand forecast
      </Text>
      <div className="dashboard__filter-bar">
        <Filter name="region" values={Object.values(Region)} />
        <Filter name="product" values={Object.values(Product)} />
      </div>
      <ForecastTable data={data} />
    </div>
  );
}
