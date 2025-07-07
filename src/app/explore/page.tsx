import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';

import './explore.scss';

export default async function ExplorePage() {
  const file = await fs.readFile(process.cwd() + '/src/app/car-data.json', 'utf8');
  const carData = JSON.parse(file);
  const makeData = carData.map((make: { make: string, logo: string }) => ({
    make: make.make,
    logo: make.logo ? make.logo : '/car.png',
  }))

  console.log(makeData)
  return (
    <div className="explore">
      <h2>Explore</h2>
      <div className="make-container">
        {makeData.map((make: { make: string, logo: string }) =>
          <Link key={make.make} href={`/explore/${make.make}`}>
            <div className="make-link">
              <Image height={200} width={200} src={make.logo} alt={`${make.make} logo`} />
              <div>{make.make}</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
