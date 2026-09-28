import { useState } from "react";

function Ratings({ value = 0, size = "medium", onChange = null }) {
  const [hoverRating, setHoverRating] = useState(null);
  const isInteractive = typeof onChange === "function";

  const sizeClass =
    size === "small" ? "bi-small" : size === "large" ? "bi-large" : "bi-medium";

  const renderStars = () => {
    const avgRating = Math.round((hoverRating ?? value) * 2) / 2;
    const isFilled = (index) => index + 1 <= avgRating;
    const isHalf = (index) =>
      !isInteractive &&
      avgRating % 1 === 0.5 &&
      index === Math.floor(avgRating);

    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi ${isFilled(index) ? "bi-star-fill" : isHalf(index) ? "bi-star-half" : "bi-star"}
         ${isFilled(index) || isHalf(index) ? "text-warning" : "text-muted"} me-1 ${sizeClass} `}
        onMouseEnter={
          isInteractive ? () => setHoverRating(index + 1) : undefined
        }
        onClick={
          isInteractive && onChange ? () => onChange(index + 1) : undefined
        }
      ></i>
    ));
  };

  return (
    <div onMouseLeave={isInteractive ? () => setHoverRating(null) : undefined}>
      {renderStars()}
    </div>
  );
}

export default Ratings;
