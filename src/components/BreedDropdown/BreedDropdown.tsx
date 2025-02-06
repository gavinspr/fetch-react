import { useState, useEffect, useRef, ChangeEvent } from "react";
import styles from "./BreedDropdown.module.scss";
import { LuChevronDown, LuX } from "react-icons/lu";
import { apiRequest } from "../../utils";
import { toast } from "react-toastify";

type PropTypes = {
  selectedBreeds: Array<string>;
  onSelect: (breeds: Array<string>) => void;
};

const BreedDropdown = ({ selectedBreeds, onSelect }: PropTypes) => {
  const [breeds, setBreeds] = useState<Array<string>>([]);
  const [filter, setFilter] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch breeds on mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await apiRequest("/dogs/breeds");
        const data: Array<string> = await response.json();
        setBreeds(data);
      } catch (err: any) {
        console.error("Error fetching breeds:", err);
        toast.error("Error fetching breeds");
      }
    };

    fetchBreeds();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBreeds: Array<string> = breeds.filter((breed) =>
    breed.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectBreed = (breed: string) => {
    const newSelection: Array<string> = selectedBreeds.includes(breed)
      ? selectedBreeds.filter((b: string) => b !== breed)
      : [...selectedBreeds, breed];
    onSelect(newSelection);
  };

  const handleRemoveBreed = (breed: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(selectedBreeds.filter((b: string) => b !== breed));
  };

  return (
    <div className={styles.dropdown} ref={wrapperRef}>
      <label className={styles.label}>Breeds</label>
      <div className={styles.multiSelect}>
        <div
          className={styles.selectedContainer}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedBreeds.map((breed: string) => (
            <div key={breed} className={styles.tag}>
              {breed}
              <button onClick={(e) => handleRemoveBreed(breed, e)}>
                <LuX size={14} />
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder={selectedBreeds.length ? "" : "Search breeds..."}
            value={filter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFilter(e.target.value);
              setIsOpen(!isOpen);
            }}
            className={styles.searchInput}
          />
          <LuChevronDown
            size={20}
            className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
          />
        </div>
        {isOpen && (
          <div className={styles.options}>
            {filteredBreeds.length > 0 ? (
              filteredBreeds.map((breed: string) => (
                <div
                  key={breed}
                  onClick={() => handleSelectBreed(breed)}
                  className={`${styles.option} ${
                    selectedBreeds.includes(breed) ? styles.selected : ""
                  }`}
                >
                  {breed}
                  {selectedBreeds.includes(breed) && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>No breeds found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedDropdown;
