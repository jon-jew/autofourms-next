import Link from 'next/link';
import Image from 'next/image';
import { promises as fs } from 'fs';

import CarCardContainer from '@/components/carCard/carCardContainer';
import { getCarsByMakeModel } from '@/lib/firebase/carServer';

import '../../explore.scss';

export default async function ModelPage({ params }:
  { params: Promise<{ model: string, make: string }> }
) {
  const modelParam = (await params).model;
  const makeParam = (await params).make;
  const file = await fs.readFile(process.cwd() + '/src/app/car-data.json', 'utf8');
  const carData = JSON.parse(file);
  const modelList = carData.find((make: { make: string }) => make.make === makeParam);
  const modelData = modelList.models.find((model: { model: string}) => model.model === modelParam);
  console.log(modelData, makeParam, modelParam)
  // if (!makeData) return <p>Not found</p>;

  const carList = await getCarsByMakeModel(makeParam, modelParam);

  // const modelData = makeData.models.map((model) => ({
  //   model: model.model,
  //   image: model.image ? model.image : '/car.png',
  // }));


  return (
    <div>
      <CarCardContainer carList={carList} />
    </div>
  )
}