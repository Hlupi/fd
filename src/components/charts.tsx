import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ForecastData, Product, Region } from "@/hooks/use-get-forecast";
import { format } from "date-fns";
import Skeleton from "@ingka/skeleton";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function DemandOverTimeChart({
  data,
  className,
}: {
  data: ForecastData[] | null;
  className?: string;
}) {
  const dates = [...new Set(data?.map((item) => item.date))].sort();
  const regions = Object.values(Region);
  const products = Object.values(Product);

  const series = regions.flatMap((region) =>
    products.map((product) => ({
      name: `${product} - ${region}`,
      data: dates.map((date) => {
        const entry = data?.find(
          (d) => d.date === date && d.region === region && d.product === product
        );
        return entry ? Math.round(entry.demand) : 0;
      }),
    }))
  );

  const options: ApexOptions = {
    chart: {
      type: "line",
    },
    title: {
      text: "Demand Over Time by Product & Region",
    },
    xaxis: {
      categories: dates.map((date) => format(date, "dd MMM")),
      title: { text: "Date" },
    },
    yaxis: {
      title: { text: "Demand" },
    },
    legend: {
      position: "top",
    },
  };

  return (
    <section
      aria-busy={data?.length ? "false" : "true"}
      aria-live="polite"
      className={className}
    >
      {!data?.length ? (
        <Skeleton height="400px" />
      ) : (
        <Chart
          options={options}
          series={series}
          type="line"
          height={400}
          aria-label="Demand Over Time Chart"
          role="region"
        />
      )}
    </section>
  );
}
