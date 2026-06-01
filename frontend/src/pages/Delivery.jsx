import Title from "../components/Title";

const Delivery = () => {
  return (
    <div className="border-t pt-10">
      <div className="text-2xl text-center">
        <Title text1="DELIVERY" text2="INFO" />
      </div>

      <div className="max-w-3xl mx-auto my-10 text-gray-600 leading-7">
        <p>
          We process confirmed orders quickly and share delivery updates as your
          package moves from our store to your address.
        </p>
        <p className="mt-4">
          Standard delivery usually takes 3 to 7 business days depending on your
          location. For help with an order, contact us at
          abhisekpanigrahy79@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default Delivery;
