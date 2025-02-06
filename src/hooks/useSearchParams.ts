import { useSearchParams } from "react-router-dom";
import { PER_PAGE_OPTIONS } from "../constants";

export const useSearchParamsState = () => {
  const [searchParams] = useSearchParams();

  const getArrayParam = (key: string): Array<string> =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const getNumberParam = (key: string, defaultValue: number): number => {
    const value = searchParams.get(key);
    return value ? Number(value) : defaultValue;
  };

  const getStringParam = (key: string): string => searchParams.get(key) || "";

  const getSortOrderParam = (): "asc" | "desc" =>
    searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

  const getValidPageSize = (): number => {
    const pageSize: number = getNumberParam("pageSize", 25);
    return PER_PAGE_OPTIONS.includes(pageSize) ? pageSize : 25;
  };

  return {
    initialBreeds: getArrayParam("breeds"),
    initialZipCodes: getArrayParam("zipCodes").map((z) => z.trim()),
    initialAgeMin: getStringParam("ageMin"),
    initialAgeMax: getStringParam("ageMax"),
    initialPageSize: getValidPageSize(),
    initialSortOrder: getSortOrderParam(),
    initialPage: getNumberParam("page", 1),
  };
};
