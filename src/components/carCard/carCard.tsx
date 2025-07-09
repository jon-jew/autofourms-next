"use client";

import React, { ReactEventHandler, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';
import clx from 'classnames';
import Chip from '@mui/material/Chip';

import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { formatLikeCount } from '../utils';

import './carCard.scss';

interface ContentProps {
  data: { [key: string]: any };
};

const CarCardContent = ({ data }: ContentProps) => (
  <div className="car-card-header loading">
    <div className="content">
      {/* <div className="like-container">
        <div className="like-count">
          <span>1000</span>
          <FavoriteIcon color="inherit" fontSize="small" />

          <Chip
            color="primary"
            icon={<PersonIcon color='primary' />}
            label={data.username}
            size="small"
            sx={{ backgroundColor: '#b81111', fontWeight: 'normal' }}
          />
        </div>
      </div> */}
      <div className="user-overlay">
        {data.username &&
          <div className="flex flex-row justify-end items-center pt-2 pr-2">
            {/* <PersonIcon color='primary' />
            <div className="ml-1">
              {data.username}
            </div> */}
            <Chip
              color="primary"
              icon={<PersonIcon color='primary' />}
              label={data.username}
              size="small"
              sx={{ backgroundColor: '#b81111', fontWeight: 'normal' }}
            />
          </div>
        }
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
          src={data.previewImage}
          className="fade-in"
          // loading="lazy"
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
  disableHover?: boolean;
  index?: number;
};

const CarCard = ({
  data,
  disableLink,
  isSmallCard,
  disableFooter,
  disableHover,
  index
}: CardProps) => {
  if (!data.previewImage) {
    return null;
  }

  return (
    <div
      className={clx({
        "car-card": true,
        "fade-in": true,
        "hover-effect": !disableHover,
        "disabled-link": disableLink,
        "small-card": isSmallCard,
      })}
    // style={{
    //   animationDelay: `${index ? index * 0.2 : 0}s`,
    // }}
    >
      {disableLink ?
        <CarCardContent data={data} />
        :
        <Link href={`/car-profile/${data.id}`}>
          <CarCardContent data={data} />
        </Link>
      }
      {!disableFooter &&
        <div className="card-footer">
          {/* {data.username &&
            <Chip
              icon={<PersonIcon />}
              label={data.username}
              size="small"
              color="primary"
              sx={{ backgroundColor: '#b81111', mr: '5px' }}
            />
          } */}
          <Chip
            icon={<FavoriteIcon />}
            label={!isNaN(data.userLikes) ?
              formatLikeCount(data.userLikes) :
              '0'}
            size="small"
            color="primary"
            sx={{ color: '#b81111', backgroundColor: '#FFF', mr: '5px' }}
          />
          {Array.isArray(data.tags) &&
            data.tags.map((tag) =>
              <div
                key={`${tag}-${data.id}`}
                className="footer-pill"
              >
                {tag}
              </div>
            )
          }
        </div>
      }
    </div>
  );
};

export default CarCard;
