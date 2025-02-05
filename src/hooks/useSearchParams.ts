import { useSearchParams } from "react-router-dom";

export const useSearchParamsState = () => {
  const [searchParams] = useSearchParams();

  const getArrayParam = (key: string): Array<string> => 
    searchParams.get(key)?.split(',').filter(Boolean) || [];

  const getNumberParam = (key: string, defaultValue: number): number => {
    const value = searchParams.get(key);
    return value ? Number(value) : defaultValue;
  };

  const getStringParam = (key: string): string => 
    searchParams.get(key) || '';

  const getSortOrderParam = (): "asc" | "desc" => 
    searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

  return {
    initialBreeds: getArrayParam("breeds"),
    initialZipCodes: getArrayParam("zipCodes").map(z => z.trim()),
    initialAgeMin: getStringParam("ageMin"),
    initialAgeMax: getStringParam("ageMax"),
    initialPageSize: getNumberParam("pageSize", 25),
    initialSortOrder: getSortOrderParam(),
    initialPage: getNumberParam("page", 1),
  };
};