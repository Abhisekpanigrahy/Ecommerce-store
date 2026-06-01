import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { assets } from "./../assets/assets";
import RelatedProducts from "./../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();

  const { products, setProducts, currency, addToCart, backendUrl, token, userData } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProductData = async () => {
      products.map((item) => {
        if (item._id == productId) {
          setProductData(item);
          setImage(item.image[0]);
          return null;
        }
      });
    };
    fetchProductData();
  }, [productId, products]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.info("Please login to submit a review.");
      return;
    }
    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/review`,
        {
          productId: productData._id,
          rating,
          comment,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setProductData(response.data.product);
        if (setProducts) {
          setProducts((prevProducts) =>
            prevProducts.map((item) =>
              item._id === response.data.product._id ? response.data.product : item
            )
          );
        }
        setRating(0);
        setComment("");
        setActiveTab("reviews");
        toast.success("Review submitted successfully.");
      } else {
        toast.error(response.data.message || "Review submission failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong submitting your review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*---------- product images ----------*/}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt="product_image"
                loading="lazy"
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="product_img" fetchpriority="high" />
          </div>
        </div>

        {/*---------- product info ----------*/}
        <div className="flex-1">
          <h1 className="font-medium text-2xl">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }, (_, index) => (
              <img
                key={index}
                src={
                  index < Math.round(productData.averageRating || 0)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                alt=""
                className="w-3.5"
              />
            ))}
            <p className="pl-2">({productData.reviewCount || productData.reviews?.length || 0})</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
                onClick={() => addToCart(productData._id, size)}
                className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
              >
                ADD TO CART
              </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this products.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/*---------- Description & Review Section ----------*/}
      <div className="mt-20">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "description" ? "bg-white border-b-white" : "bg-gray-100"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "reviews" ? "bg-white border-b-white" : "bg-gray-100"
            }`}
          >
            Reviews ({productData.reviewCount || productData.reviews?.length || 0})
          </button>
        </div>

        {activeTab === "description" ? (
          <div className="flex flex-col gap-4 border px-6 py-4 text-sm text-gray-500">
            <p>{productData.description}</p>
          </div>
        ) : (
          <div className="border px-6 py-6 bg-gray-50 rounded-md">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-semibold">Customer rating:</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <img
                    key={index}
                    src={
                      index < Math.round(productData.averageRating || 0)
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt=""
                    className="w-3.5"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {productData.averageRating ? productData.averageRating.toFixed(1) : "0.0"} / 5
              </span>
            </div>

            {userData ? (
              <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Your rating:</p>
                  {Array.from({ length: 5 }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(index + 1)}
                      className="focus:outline-none"
                    >
                      <img
                        src={index < rating ? assets.star_icon : assets.star_dull_icon}
                        alt={`${index + 1} star`}
                        className="w-5"
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full border rounded p-3 resize-none"
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-black text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit review"}
                </button>
              </form>
            ) : (
              <p className="mt-4 text-sm text-gray-600">Login to submit a review.</p>
            )}

            <div className="mt-8 space-y-4">
              {productData.reviews?.length > 0 ? (
                [...productData.reviews]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((review, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, starIndex) => (
                            <img
                              key={starIndex}
                              src={
                                starIndex < review.rating
                                  ? assets.star_icon
                                  : assets.star_dull_icon
                              }
                              alt=""
                              className="w-3.5"
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="mt-3 text-gray-600">{review.comment}</p>}
                    </div>
                  ))
              ) : (
                <div className="border p-6 rounded-md text-gray-600">
                  No reviews yet. Be the first to rate this product.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---------- Display related products ---------- */}

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
