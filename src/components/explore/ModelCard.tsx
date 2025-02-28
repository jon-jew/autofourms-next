import Image from 'next/image';

import './modelCard.scss';

const ModelCard = ({ model, image }) => (
  <div className="model-card">
    <div className="model-image">
      <Image
        fill
        style={{
          objectFit: image === '/car.png' ? 'none' : 'contain',
          objectPosition: 'bottom',
        }}
        src={image}
        alt={`${model} image`}
      />
    </div>
    <div className="model-text">
      <h2>{model}</h2>
    </div>
  </div>
);

export default ModelCard;
