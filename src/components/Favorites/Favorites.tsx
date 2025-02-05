import styles from "./Favorites.module.scss";
import { Dog } from "../../types";
import DogCard from "../DogCard/DogCard";
import JSConfetti from "js-confetti";
import { apiRequest } from "../../utils";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type PropTypes = {
  favorites: Array<Dog>;
  toggleFavorite: (dog: Dog) => void;
  setMatch: Dispatch<SetStateAction<Dog | undefined>>;
};

const Favorites = ({ favorites, toggleFavorite, setMatch }: PropTypes) => {
  const jsConfetti = new JSConfetti();

  const handleGenerateMatch = async () => {
    try {
      const matchIds: Array<string> = favorites.map((dog: Dog) => dog.id);

      const response = await apiRequest("/dogs/match", {
        method: "post",
        body: JSON.stringify(matchIds),
      });

      if (!response.ok) {
        throw new Error(`Failed to find match`);
      }

      const { match } = await response.json();

      if (match?.length > 0) {
        const dogsResponse = await apiRequest(`/dogs`, {
          method: "POST",
          body: JSON.stringify([match]),
        });

        if (!dogsResponse.ok) {
          throw new Error(`Failed to fetch match details`);
        }

        const dogsData: Array<Dog> = await dogsResponse.json();
        setMatch(dogsData[0]);
      }

      jsConfetti.addConfetti({
        emojis: ["🐶", "🐕 ", "🦴", "🐾"],
        emojiSize: 48,
        confettiRadius: 5,
        confettiNumber: 100,
      });
    } catch (err: any) {
      console.error("Match generation failed:", err);
      toast.error(err.message);
    }
  };

  return (
    <div className={styles.favorites}>
      <h2>Favorites</h2>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((dog: Dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              isFavorite={favorites.includes(dog)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </ul>
      ) : (
        <p>No favorites selected.</p>
      )}
      {favorites.length > 0 && (
        <button onClick={handleGenerateMatch}>Generate Match</button>
      )}
    </div>
  );
};

export default Favorites;
