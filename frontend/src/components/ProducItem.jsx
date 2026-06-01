import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { assets } from "../assets/assets";

const ProducItem = ({ id, image, name, price, averageRating = 0, reviewCount = 0, sizes = [] }) => {
  const { currency, userData, toggleWishlist, addToCart } = useContext(ShopContext);
  const isWishlisted = userData?.wishlist?.includes(id);
  const defaultSize = sizes?.[0] || "S";

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, defaultSize);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
      <button
        type="button"
        onClick={handleWishlistClick}
        className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xl transition ${
          isWishlisted ? "text-red-600 bg-red-50 border-red-200" : "text-gray-400 hover:text-red-600 hover:bg-red-50"
        }`}
      >
        ♥
      </button>

      <Link
        to={`/product/${id}`}
        onClick={handleClick}
        className="block"
      >
        <div className="overflow-hidden rounded-t-3xl bg-gray-100">
          <img
            className="h-[240px] w-full object-cover transition duration-500 ease-out group-hover:scale-105"
            src={image[0]}
            alt="product_img"
          />
        </div>

        <div className="px-4 pb-4 pt-4">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">{name}</p>

          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <img
                  key={index}
                  src={
                    index < Math.round(averageRating || 0)
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  alt=""
                  className="w-3"
                />
              ))}
              <span className="text-xs text-gray-500">
                {averageRating ? averageRating.toFixed(1) : "0.0"} ({reviewCount || 0})
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-bold text-black">
                {currency}
                {price}
              </p>
              <button
                type="button"
                onClick={handleAddToCart}
                className="rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

ProducItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  averageRating: PropTypes.number,
  reviewCount: PropTypes.number,
  sizes: PropTypes.arrayOf(PropTypes.string),
};

export default ProducItem;
