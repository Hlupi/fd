import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export enum Region {
  EU = "EU",
  US = "US",
  APAC = "APAC",
  LATAM = "LATAM",
}

export enum Product {
  WidgetA = "Widget A",
  WidgetB = "Widget B",
  WidgetC = "Widget C",
  WidgetD = "Widget D",
}

export interface ForecastData {
  date: string;
  region: Region;
  product: Product;
  demand: number;
}

interface UseForecastReturn {
  data: ForecastData[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useForecast = (): UseForecastReturn => {
  const [data, setData] = useState<ForecastData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const { from, to } = router.query;
  const region = Array.isArray(router.query.region)
    ? router.query.region.join(",")
    : router.query.region;
  const product = Array.isArray(router.query.product)
    ? router.query.product.join(",")
    : router.query.product;

  const params = {
    from: (from as string) || "",
    to: (to as string) || "",
    region: region || "",
    product: product || "",
  };

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}forecast/`);
  for (const [key, val] of Object.entries(params)) {
    if (val) {
      url.searchParams.append(key, val);
    }
  }

  const fetchForecast = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<ForecastData[]>(url.toString());
      setData(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? `Error: ${err.response?.status} ${err.message}`
        : "An unknown error occurred";
      setError(new Error(errorMessage));
      console.error("Error fetching forecast data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchForecast();
    }
  }, [router.isReady, from, to, region, product]);

  return { data, isLoading, error, refetch: fetchForecast };
};
