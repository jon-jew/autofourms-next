import Link from 'next/link';
import Image from 'next/image';
import { promises as fs } from 'fs';

import CarCardContainer from '@/components/carCard/carCardContainer';
import ModelCard from '@/components/explore/ModelCard';
import { getCarsByMake } from '@/lib/firebase/car';

import '../explore.scss';

export default async function MakePage({ params }:
  { params: Promise<{ make: string }>}
) {
  const makeParam = (await params).make;
  const file = await fs.readFile(process.cwd() + '/src/app/car-data.json', 'utf8');
  const carData = JSON.parse(file);
  const makeData = carData.find((make) => make.make === makeParam);

  if (!makeData) return <p>Not found</p>;

  const carList = await getCarsByMake(makeParam);

  const modelData = makeData.models.map((model) => ({
    model: model.model,
    image: model.image ? model.image : '/car.png',
  }));


  return (
    <div>
      <Image src={makeData.logo} height={40} width={40} />
    <div className="model-container">
      {modelData.map((model) =>
        <Link href={`/explore/${makeParam}/${model.model}`} key={model.model}>
          <ModelCard model={model.model} image={model.image} />
        </Link>
      )}
    </div>
    <CarCardContainer carList={carList} />
    </div>
  )
}