import { ChangeEvent, useEffect, useRef, useState } from "react";
import BreedDropdown from "../BreedDropdown/BreedDropdown";
import styles from "./Filters.module.scss";
import { LuChevronDown } from "react-icons/lu";
import { PER_PAGE_OPTIONS } from "../../constants";

type PropTypes = {
  selectedBreeds: Array<string>;
  onBreedChange: (breeds: Array<string>) => void;
  zipCodes: Array<string>;
  onZipCodesChange: (zipCodes: Array<string>) => void;
  ageMin: number | "";
  onAgeMinChange: (age: number | "") => void;
  ageMax: number | "";
  onAgeMaxChange: (age: number | "") => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  sortOrder: "asc" | "desc";
  toggleSortOrder: () => void;
  onClearFilters: () => void;
};

const Filters = ({
  selectedBreeds,
  onBreedChange,
  zipCodes,
  onZipCodesChange,
  ageMin,
  onAgeMinChange,
  ageMax,
  onAgeMaxChange,
  pageSize,
  onPageSizeChange,
  sortOrder,
  toggleSortOrder,
  onClearFilters,
}: PropTypes) => {
  const [zipCodesString, setZipCodesString] = useState<string>(
    zipCodes.join(", ")
  );
  const [isPerPageOpen, setIsPerPageOpen] = useState<boolean>(false);

  const perPageRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        perPageRef.current &&
        !perPageRef.current.contains(event.target as Node)
      ) {
        setIsPerPageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync local state with zipCodes prop
  useEffect(() => {
    setZipCodesString(zipCodes.join(", "));
  }, [zipCodes]);

  // Debounce zip code updates
  useEffect(() => {
    const handler = setTimeout(() => {
      const zipCodes: Array<string> = zipCodesString
        .split(",")
        .map((z: string) => z.trim())
        .filter((z) => z !== "");
      onZipCodesChange(zipCodes);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [zipCodesString, onZipCodesChange]);

  const handleZipCodesChange = (value: string) => {
    setZipCodesString(value);
  };

  return (
    <div className={styles.filters}>
      <div className={styles.header}>
        <h3>Filters</h3>
      </div>
      <div className={styles.row}>
        <BreedDropdown
          selectedBreeds={selectedBreeds}
          onSelect={onBreedChange}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Zip Codes</label>
          <input
            type="text"
            placeholder="e.g. 12345, 67890"
            value={zipCodesString}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleZipCodesChange(e.target.value)
            }
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Age Range</label>
          <div className={styles.ageRange}>
            <input
              type="number"
              placeholder="Min"
              value={ageMin}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onAgeMinChange(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
            <span className={styles.rangeSeparator}>–</span>
            <input
              type="number"
              placeholder="Max"
              value={ageMax}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onAgeMaxChange(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>
        </div>
        <div className={`${styles.inputGroup} ${styles.perPageGroup}`}>
          <label>Results Per Page</label>
          <div className={styles.pageSize} ref={perPageRef}>
            <div
              className={styles.dropdownHeader}
              onClick={() => setIsPerPageOpen(!isPerPageOpen)}
            >
              Show {pageSize}{" "}
              <LuChevronDown
                size={20}
                className={`${styles.chevron} ${
                  isPerPageOpen ? styles.rotated : ""
                }`}
              />
            </div>
            {isPerPageOpen && (
              <div className={styles.options}>
                {PER_PAGE_OPTIONS.map((size: number) => (
                  <div
                    key={size}
                    className={`${styles.option} ${
                      size === pageSize ? styles.selected : ""
                    }`}
                    onClick={() => {
                      onPageSizeChange(size);
                      setIsPerPageOpen(false);
                    }}
                  >
                    Show {size}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.inputGroup} ${styles.sortButtonGroup}`}>
          <label>Breed Sort Order</label>
          <button onClick={toggleSortOrder} className={styles.sortButton}>
            {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </button>
        </div>
      </div>
      <button onClick={onClearFilters} className={styles.clearButton}>
        Clear All Filters
      </button>
    </div>
  );
};

export default Filters;
