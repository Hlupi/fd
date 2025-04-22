import axios from "axios";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

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

interface ForecastError {
  message: string;
  statusCode?: number;
  userMessage?: string;
}

interface UseGetForecastReturn {
  data: ForecastData[] | null;
  isLoading: boolean;
  error: ForecastError | null;
  refetch: () => void;
}

export const fetchForecast = async (
  params: Record<string, string>
): Promise<ForecastData[]> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}forecast/`);
  for (const [key, val] of Object.entries(params)) {
    if (val) {
      url.searchParams.append(key, val);
    }
  }

  try {
    const response = await axios.get<ForecastData[]>(url.toString());
    return response.data;
  } catch (err: unknown) {
    let forecastError: ForecastError = {
      message: "An unexpected error occurred.",
    };

    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 500) {
        forecastError = {
          message: "Internal server error",
          statusCode: 500,
          userMessage:
            "Oops! Something went wrong on our end. Please try again shortly.",
        };
      } else if (status) {
        forecastError = {
          message: err.message,
          statusCode: status,
          userMessage: `Something went wrong (status: ${status}).`,
        };
      } else if (err.request) {
        forecastError = {
          message: "No response received from server.",
          userMessage: "Check your internet connection and try again.",
        };
      }
    } else if (err instanceof Error) {
      forecastError.message = err.message;
    }

    throw forecastError;
  }
};

export const useGetForecast = (): UseGetForecastReturn => {
  const router = useRouter();

  const region = Array.isArray(router.query.region)
    ? router.query.region.join(",")
    : router.query.region;
  const product = Array.isArray(router.query.product)
    ? router.query.product.join(",")
    : router.query.product;

  const params = useMemo(
    () => ({
      from: (router.query.from as string) || "",
      to: (router.query.to as string) || "",
      region: region || "",
      product: product || "",
    }),
    [router.query.from, router.query.to, region, product]
  );

  const { data, isLoading, error, refetch } = useQuery<
    ForecastData[],
    ForecastError
  >({
    queryKey: ["forecast", params],
    queryFn: () => fetchForecast(params),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error ?? null,
    refetch,
  };
};
