"use client";
import React, { useState, useEffect, useContext } from 'react';

import CarCard from '@/components/carCard/carCard';
import { LoadingContext } from '@/contexts/loadingOverlayContext';
import { getCars } from '@/lib/firebase/firebase';

import './home.scss';

const Home = () => {
  const { setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState([]);
  const fetchCars = async () => {
    const res = await getCars();
    if (res) setData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCars();
  }, []);

  return (
    <div className="car-card-container">
      {data && data.map((car) => 
        <CarCard key={car.id} data={car} />
      )}
    </div>
  );
}

export default Home;
