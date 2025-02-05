import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./DogSearchPage.module.scss";
import { Dog, SearchResultsType } from "../../../types";
import { apiRequest } from "../../../utils";
import Filters from "../../Filters/Filters";
import DogCard from "../../DogCard/DogCard";
import Pagination from "../../Pagination/Pagination";
import Favorites from "../../Favorites/Favorites";
import { toast } from "react-toastify";
import { useSearchParamsState } from "../../../hooks";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

export const DogSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    initialBreeds,
    initialZipCodes,
    initialAgeMin,
    initialAgeMax,
    initialPageSize,
    initialSortOrder,
    initialPage,
  } = useSearchParamsState();

  const [selectedBreeds, setSelectedBreeds] =
    useState<Array<string>>(initialBreeds);
  const [zipCodes, setZipCodes] = useState<Array<string>>(initialZipCodes);
  const [ageMin, setAgeMin] = useState<number | "">(
    initialAgeMin ? Number(initialAgeMin) : ""
  );
  const [ageMax, setAgeMax] = useState<number | "">(
    initialAgeMax ? Number(initialAgeMax) : ""
  );
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [dogs, setDogs] = useState<Array<Dog>>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Array<Dog>>([]);
  const [match, setMatch] = useState<Dog | undefined>(undefined);

  // Fetch dogs when filters change
  useEffect(() => {
    const fetchDogs = async () => {
      setIsLoading(true);
      try {
        const from: number = (currentPage - 1) * pageSize;

        const params = new URLSearchParams();

        params.append("size", pageSize.toString());
        params.append("from", from.toString());
        params.append("sort", `breed:${sortOrder}`);

        selectedBreeds.forEach((breed: string) =>
          params.append("breeds", breed)
        );

        zipCodes
          .filter((zip: string) => zip.length > 0)
          .forEach((zip: string) => params.append("zipCodes", zip));

        if (ageMin !== "") params.append("ageMin", String(ageMin));
        if (ageMax !== "") params.append("ageMax", String(ageMax));

        const searchUrl: string = `/dogs/search?${params.toString()}`;
        const searchResponse = await apiRequest(searchUrl);

        if (!searchResponse.ok)
          throw new Error("Error fetching search results");

        const searchData: SearchResultsType = await searchResponse.json();
        const { resultIds, total } = searchData;
        setTotal(total);

        if (resultIds?.length > 0) {
          const dogsResponse = await apiRequest(`/dogs`, {
            method: "POST",
            body: JSON.stringify(resultIds),
          });

          const dogsData: Array<Dog> = await dogsResponse.json();
          setDogs(dogsData);
        } else {
          setDogs([]);
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, [
    currentPage,
    selectedBreeds,
    zipCodes,
    ageMin,
    ageMax,
    pageSize,
    sortOrder,
  ]);

  // Update URL params
  useEffect(() => {
    const nonEmptyZipCodes: Array<string> = zipCodes.filter(
      (zip: string) => zip.length > 0
    );

    const params: Record<string, string> = {
      pageSize: String(pageSize),
      sortOrder: sortOrder,
      page: String(currentPage),
    };

    if (selectedBreeds.length > 0) params.breeds = selectedBreeds.join(",");
    if (nonEmptyZipCodes.length > 0)
      params.zipCodes = nonEmptyZipCodes.join(",");
    if (ageMin !== "") params.ageMin = String(ageMin);
    if (ageMax !== "") params.ageMax = String(ageMax);

    setSearchParams(params);
  }, [
    selectedBreeds,
    zipCodes,
    ageMin,
    ageMax,
    pageSize,
    sortOrder,
    currentPage,
    setSearchParams,
  ]);

  const toggleSortOrder = () =>
    setSortOrder((prev: "asc" | "desc") => (prev === "asc" ? "desc" : "asc"));

  const toggleFavorite = (dog: Dog) => {
    setFavorites((prev: Array<Dog>) =>
      prev.includes(dog) ? prev.filter((d: Dog) => d !== dog) : [...prev, dog]
    );
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleClearFilters = () => {
    setSelectedBreeds([]);
    setZipCodes([]);
    setAgeMin("");
    setAgeMax("");
    setPageSize(25);
    setSortOrder("asc");
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      {!match ? (
        <>
          <Filters
            selectedBreeds={selectedBreeds}
            onBreedChange={setSelectedBreeds}
            zipCodes={zipCodes}
            onZipCodesChange={setZipCodes}
            ageMin={ageMin}
            onAgeMinChange={setAgeMin}
            ageMax={ageMax}
            onAgeMaxChange={setAgeMax}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            sortOrder={sortOrder}
            toggleSortOrder={toggleSortOrder}
            onClearFilters={handleClearFilters}
          />
          {dogs.length > 0 && (
            <div className={styles.grid}>
              {dogs.map((dog: Dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={favorites.includes(dog)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
          {isLoading && (
            <div className={styles.loader}>
              <BeatLoader color="#f8a619" size={24} />
            </div>
          )}
          {!isLoading && dogs.length === 0 && (
            <h2 className={styles.noneFound}>
              No dogs found matching your criteria
            </h2>
          )}
          <Pagination
            currentPage={currentPage}
            total={total}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
          <Favorites
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setMatch={setMatch}
          />
        </>
      ) : (
        <div className={styles.match}>
          <div className={styles.return} onClick={() => setMatch(undefined)}>
            <FaLongArrowAltLeft />
            <p>Return to search</p>
          </div>
          <h2>Meet Your Match!</h2>
          <div className={styles.dog}>
            <DogCard
              key={`match-${match.id}`}
              dog={match}
              isMatch={true}
              toggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      )}
    </div>
  );
};
