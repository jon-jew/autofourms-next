import React from "react";

import CarCard from "./carCard";
import "./carCard.scss";

const CarCardContainer = ({ carList }: { carList: { [key: string]: any }[]}) => (
  <div className="car-card-container">
    {carList.map((carData: { [key: string]: any }) =>
      <CarCard key={carData.id} data={carData} />
    )}
  </div>
);

export default CarCardContainer;
