import  { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProducItem from "./ProducItem";

const BestSeller = () => {

  const { products, loading } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      // bestseller is the object key
      const bestProduct = products.filter((item)=>(item.bestseller)); // if bestseller: true
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Our most popular products, loved by customers for their exceptional quality and timeless design. Shop our top-rated favorites.
        </p>
      </div>

      {/* rendering best products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {
        bestSeller.length > 0 ? (
          bestSeller.map((item, index) => (
            <ProducItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              sizes={item.sizes}
              averageRating={item.averageRating}
              reviewCount={item.reviewCount}
            />
          ))
        ) : (
          // Skeleton loaders
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-[240px] w-full rounded-3xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        )
        }
      </div>


    </div>
  );
};

export default BestSeller;
