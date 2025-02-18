"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'next/navigation';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';

import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';

import { Header, ImageGallery, InfoPanel, ArticlePanel } from '@/components/carPage';
import { LoadingContext } from '@/contexts/loadingOverlayContext';
import { getCar } from '@/lib/firebase/firebase';

import './carPage.scss'

const tabSx = { backgroundColor: '#ffffffb4' };

export default function CarPage({
  params,
}: {
  params: Promise<{ carId: string }>
}) {
  const { setIsLoading } = useContext(LoadingContext);
  const searchParams = useSearchParams();
  const tabNum = searchParams ? searchParams.get('tab') : null;

  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const [carId, setCarId] = useState<string | null>(null);
  const [value, setValue] = useState<string>(tabNum ? tabNum : '1');

  useEffect(() => {
    const fetchCarInfo = async () => {
      const param = (await params).carId;
      const carInfo = await getCar(param);
      setData(carInfo);
      setCarId(param);
      setIsLoading(false);
    }
    setIsLoading(true);
    fetchCarInfo();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="car-page">
      {data && carId &&
        <>
          <Header data={data} />
          <div className="tabs-container">
            <TabContext value={value}>
              <Tabs
                value={value}
                centered
                onChange={handleChange}
                aria-label="car page tabs"
                sx={{
                  ".Mui-selected": { color: `#b81111 !important`, },
                  ".MuiTabs-indicator": { backgroundColor: `#b81111 !important` },
                }}
              >
                <Tab value="1" sx={tabSx} icon={<PhotoLibraryIcon />} />
                <Tab value="2" sx={tabSx} icon={<InfoIcon />} />
                <Tab value="3" sx={tabSx} icon={<ArticleIcon />} />
              </Tabs>
              <div
                className="tab-panel"
                style={{
                  display: value === "1" ? 'block' : 'none'
                }}
              >
                <ImageGallery ownerId={data.userId} carId={carId} />
              </div>
              <div
                style={{
                  display: value === "2" ? 'block' : 'none'
                }}
                className="tab-panel"
              >
                <InfoPanel data={data} />
              </div>
              <div
                className="tab-panel"
                style={{
                  display: value === "3" ? 'block' : 'none'
                }}
              >
                <ArticlePanel ownerId={data.userId} identifier={carId} pageType="car" />
              </div>
            </TabContext>
          </div>
        </>}
    </div>
  );
}
