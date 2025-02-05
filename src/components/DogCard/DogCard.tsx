import styles from "./DogCard.module.scss";
import { Dog } from "../../types";
import { FaStar, FaRegStar } from "react-icons/fa";

type PropTypes = {
  dog: Dog;
  isFavorite?: boolean;
  toggleFavorite: (dog: Dog) => void;
  isMatch?: boolean;
};

const DogCard = ({ dog, isFavorite, toggleFavorite, isMatch }: PropTypes) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.favoriteIcon}
        onClick={() => toggleFavorite(dog)}
        title={isFavorite ? "Unfavorite" : "Favorite"}
      >
        {!isMatch && isFavorite ? <FaStar /> : !isMatch ? <FaRegStar /> : null}
      </div>
      <img src={dog.img} alt={dog.name} className={styles.image} />
      <div className={styles.details}>
        <h3>{dog.name}</h3>
        <p>
          <strong>Age:</strong> {dog.age}
        </p>
        <p>
          <strong>Breed:</strong> {dog.breed}
        </p>
        <p>
          <strong>Zip Code:</strong> {dog.zip_code}
        </p>
      </div>
    </div>
  );
};

export default DogCard;
