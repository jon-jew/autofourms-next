"use client";

import React, { ReactEventHandler, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clx from 'classnames';
import Chip from '@mui/material/Chip';

import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

import './carCard.scss';

interface ContentProps {
  data: { [key: string]: any };
  onLoad: ReactEventHandler<HTMLImageElement>;
  loaded: boolean;
};

const CarCardContent = ({ data, onLoad, loaded }: ContentProps) => (
  <div className="car-card-header loading">
    <div
      className="content"
      style={{ opacity: loaded ? 1 : 0 }}
    >
      <div className="like-container">
        <div className="like-count">
        { Math.floor(Math.random() * 1000)} <FavoriteIcon sx={{ color: '#ba6666' }} fontSize="small" />
        </div>
      </div>
      <div className="card-overlay">
        <div className="card-overlay-title">
          <span className="title-year">{data.modelYear}</span>
          <br />
          <span className="title-model">
            {data.make} {data.model}
          </span>
          {data.submodel &&
            <span className="title-submodel">
              ({data.submodel})
            </span>
          }
        </div>
      </div>
      <div className="card-photo">
        <Image
          onLoad={onLoad}
          src={data.previewImage}
          loading="lazy"
          alt={`thumbnail for ${data.id}`}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  </div>
);

interface CardProps {
  data: { [key: string]: any };
  disableLink?: boolean;
  isSmallCard?: boolean;
  disableFooter?: boolean;
};

const CarCard = ({ data, disableLink, isSmallCard, disableFooter }: CardProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const onLoad = () => setLoaded(true);

  if (!data.previewImage) return null;

  return (
    <div
      className={clx({
        "car-card": true,
        "disabled-link": disableLink,
        "small-card": isSmallCard,
      })}
    >
      {disableLink ?
        <CarCardContent data={data} onLoad={onLoad} loaded={loaded} />
        :
        <Link href={`/car-profile/${data.id}`}>
          <CarCardContent data={data} onLoad={onLoad} loaded={loaded} />
        </Link>
      }
      {!disableFooter &&
        <div className="card-footer">
          {data.username &&
            <Chip
              icon={<PersonIcon />}
              label={data.username}
              size="small"
              color="primary"
              sx={{ backgroundColor: '#b81111', mr: '5px' }}
            />
          }
          {Array.isArray(data.tags) &&
            data.tags.map((tag) =>
              <div key={`${tag}-${data.id}`} className="footer-pill">{tag}</div>
            )
          }
        </div>
      }
    </div>
  );
};

export default CarCard;
