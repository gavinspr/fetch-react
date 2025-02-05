import styles from "./Favorites.module.scss";
import { Dog } from "../../types";
import DogCard from "../DogCard/DogCard";

type PropTypes = {
  favorites: Array<Dog>;
  toggleFavorite: (dog: Dog) => void;
};

const Favorites = ({ favorites, toggleFavorite }: PropTypes) => {
  const generateMatch = async () => {};

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
        <button onClick={generateMatch}>Generate Match</button>
      )}
    </div>
  );
};

export default Favorites;
