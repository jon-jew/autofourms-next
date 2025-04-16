'use client';

import React, { useRef } from 'react';
import Link from 'next/link';

import ModelCard from '../ModelCard';

import './modelContainer.scss';

const ModelContainer = ({ make, models }) => {
  const containerRef = useRef(null);


  const handleRightScroll = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      containerRef.current.scrollBy({
        left: containerWidth,
        behavior: 'smooth',
      })
    }
  }

  const handleLeftScroll = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      containerRef.current.scrollBy({
        left: -containerWidth,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="model-container">
      <button onClick={handleLeftScroll} className="btn btn-left">
        ‹
      </button>
      <div ref={containerRef} className="model-gallery">
      {models.map((model) =>
        <Link href={`/explore/${make}/${model.model}`} key={model.model}>
          <ModelCard model={model.model} image={model.image} />
        </Link>
      )}
      </div>
      <button onClick={handleRightScroll} className="btn btn-right">
        ›
      </button>
    </div>

  )
};

export default ModelContainer;
