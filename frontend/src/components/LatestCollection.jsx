import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProducItem from "./ProducItem";

const LatestCollection = () => {
  const { products, loading } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our newest arrivals, featuring the latest trends and styles curated just for you. Explore our fresh collections today.
        </p>
      </div>


{/* rendering latest products */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
{
  latestProducts.length > 0 ? (
    latestProducts.map((item,index)=>(
      <ProducItem
        key={index}
        id={item._id}
        image={item.image}
        name={item.name}
        price={item.price}
        sizes={item.sizes}
        averageRating={item.averageRating}
        reviewCount={item.reviewCount}
      />
    ))
  ) : (
    // Skeleton loaders
    Array.from({ length: 10 }).map((_, index) => (
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

export default LatestCollection;
