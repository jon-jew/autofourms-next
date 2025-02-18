"use client";

import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';

import { toTitleCase } from '../utils';
import { UserContext } from '@/contexts/userContext';
import wheelIcon from '../../assets/wheelIcon.png';
import { getCategories } from '../editPanel/fieldSettings';

import './infoPanel.scss';

const InfoPanelCard = ({ data, thumbnail, title, name, icon }) => {
  return (
    <div className="info-panel-card">
      <div className="card-header">
        {icon}
        <div>
          {title}
        </div>
      </div>
      <div className="card-body">
        {thumbnail &&
          <div className="info-thumbnail" >
            <Image
              src={thumbnail}
              alt={`${title} thumbnail`}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        }
        <table className="info-table">
          <tbody>
            {Object.keys(data).map((key) => (
              <tr key={`${key}-${data[key].value}`} className="body-row">
                <td className="body-title">{toTitleCase(key)}</td>
                <td className="body-text">
                  {data[key].value}
                  {/* {data[key].image && <div><img className="body-img" src={data[key].image} /></div>} */}
                </td>
                {data[key].description &&
                  <div>
                    <IconButton sx={{ marginTop: '-5px' }} size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </div>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const convertToWheelSpecs = ({ diameter, width, offset }) => {
  const signedOffset = offset >= 0 ? `+${offset}` : offset;
  return `${diameter}x${width} ${signedOffset}`;
}

const WheelInfoCard = ({ data, thumbnail }) => {
  return (
    <div className="info-panel-card">
      <div className="card-header">
        <div className="info-card-img">
          <Image
            src={wheelIcon}
            alt="wheel icon"
            height={24}
            width={24}
          />
        </div>
        <div>Wheels and Tires</div>
      </div>
      <div className="card-body">
        {thumbnail &&
          <div>
            <img className="info-thumbnail" width={250} src={thumbnail} />
          </div>
        }
        <div className="body-row">
          <div className="body-title">Wheels</div>
          <div className="body-text">
            {
              data.isStaggered ?
                <div>
                  F: {data.wheel.front.brand} {data.wheel.front.model} {convertToWheelSpecs(data.wheel.front)}<br />
                  R: {data.wheel.rear.brand} {data.wheel.rear.model} {convertToWheelSpecs(data.wheel.rear)}
                </div>
                :
                <div>{data.wheel.front.brand} {data.wheel.front.model}<br />
                  {convertToWheelSpecs(data.wheel.front)}
                </div>
            }
          </div>
        </div>
        <div className="body-row">
          <div className="body-title">Tires</div>
          <div className="body-text">
            {
              data.isStaggered ?
                <div>
                  F: {data.tire.front.brand} {data.tire.front.model} {data.tire.front.size}
                  R: {data.tire.rear.brand} {data.tire.rear.model} {data.tire.rear.size}
                </div> :
                <div>
                  {data.tire.front.brand} {data.tire.front.model}<br />
                  {data.tire.front.size}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoPanel = ({ data }) => {
  const { user, userLoading } = useContext(UserContext);
  const categories = getCategories();

  if (data)
    return (
      <div>
        <div className="top-button-container">
          {user && !userLoading && user.uid === data.userId &&
            <Link href={`/edit-car/${data.id}`}>
              <Button variant="contained" startIcon={<EditIcon />} size="small">
                Edit Profile
              </Button>
            </Link>
          }
        </div>
        <div className="info-panel-container">

          <InfoPanelCard
            title="Specification"
            name="specification"
            data={data.specification}
            icon={categories[0].icon}
          />
          <WheelInfoCard
            thumbnail={data.thumbnails ? data.thumbnails.wheels : null}
            data={data.wheelTire}
          />
          {categories.slice(1).map((category, idx) => {
            if (data[category.name] && Object.keys(data[category.name]).length > 0) {
              return (
                <InfoPanelCard
                  key={`info-card-${category.name}`}
                  title={category.title}
                  name={category.name}
                  data={data[category.name]}
                  thumbnail={data.thumbnails[category.name]}
                  icon={category.icon}
                />
              )
            }
          })}
        </div>
      </div>
    );
}

export default InfoPanel;
