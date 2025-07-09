"use client";

import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';

import { toTitleCase } from '../../utils';
import { UserContext } from '@/contexts/userContext';
import { getCategories } from '../../editPanel/fieldSettings';

import './infoPanel.scss';

const InfoPanelCard = (
  { data, thumbnail, title, icon }:
    {
      data: { [key: string]: any },
      thumbnail?: string,
      title: string,
      icon: React.JSX.Element,
    }
) => {
  return (
    <div className="info-card-container">
      <div className="info-panel-card">
        <div className="card-header">
          {icon}
          <span>
            {title}
          </span>
        </div>
        <div className="card-body">
          <table className="info-table">
            <tbody>
              {Object.keys(data)
                .sort((a, b) => data[a].order - data[b].order)
                .map((key) => (
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
        </div>
      </div>
    </div>
  );
};

const convertToWheelSpecs = (
  { diameter, width, offset }:
    { diameter: number, width: number, offset: number }
) => {
  const signedOffset = offset >= 0 ? `+${offset}` : offset;
  return `${diameter}x${width} ${signedOffset}`;
}

const WheelInfoCard = (
  { data, thumbnail }:
    { data: { [key: string]: any }, thumbnail: string }
) => {
  return (
    <div className="info-card-container">
      <div className="info-panel-card">
        <div className="card-header">
          <Image
            src="/wheel-icon-red.png"
            alt="wheel icon"
            height={24}
            width={24}
          />
          <span>Wheels and Tires</span>
        </div>
        <div className="card-body">
          <table className="info-table">
            <tbody>
              <tr className="body-row">
                <td className="wheel-title">Wheels</td>
                <td className="wheel-text">
                  {
                    data.isStaggered ?
                      <>
                        F: {data.wheel.front.brand} {data.wheel.front.model} {convertToWheelSpecs(data.wheel.front)}<br />
                        R: {data.wheel.rear.brand} {data.wheel.rear.model} {convertToWheelSpecs(data.wheel.rear)}
                      </>
                      :
                      <>{data.wheel.front.brand} {data.wheel.front.model}<br />
                        {convertToWheelSpecs(data.wheel.front)}
                      </>
                  }
                </td>
              </tr>
              <tr className="body-row">
                <td className="wheel-title">Tires</td>
                <td className="wheel-text">
                  {
                    data.isStaggered ?
                      <>
                        F: {data.tire.front.brand} {data.tire.front.model} {data.tire.front.size}
                        R: {data.tire.rear.brand} {data.tire.rear.model} {data.tire.rear.size}
                      </> :
                      <>
                        {data.tire.front.brand} {data.tire.front.model}<br />
                        {data.tire.front.size}
                      </>
                  }
                </td>
              </tr>
            </tbody>
          </table>
          {thumbnail &&
            <div className="info-thumbnail" >
              <Image
                src={thumbnail}
                alt="Wheels thumbnail"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

const InfoPanel = ({ data, isUserOwner }: { data: { [key: string]: any }, isUserOwner: boolean }) => {
  const categories = getCategories();
  if (data)
    return (
      <div>
        <div className="top-button-container">
          {isUserOwner &&
            <Link href={`/edit-car/${data.id}`}>
              <Button variant="contained" startIcon={<EditIcon />} size="small">
                Edit Profile
              </Button>
            </Link>
          }
        </div>
        <div className="info-panel-container">
          {Object.keys(data.specification).length > 0 &&
            <InfoPanelCard
              title="Specification"
              data={data.specification}
              icon={categories[0].icon}
            />
          }
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
