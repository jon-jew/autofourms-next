'use client';

import React, { useState, useEffect, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';

import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';

import { Header, ImageGallery, InfoPanel, ArticlePanel } from '@/components/carPage';
import { LoadingContext } from '@/contexts/loadingOverlayContext';
import { getCar } from '@/lib/firebase/car';

// import './carPage.scss'

const tabSx = { backgroundColor: '#ffffffb4' };

export default function CarPage({
  carId,
  data,
  images,
  tab,
}: {
  carId: string,
  data: { [key: string]: any },
  images?: string[],
  tab?: string,
}) {

  const router = useRouter();
  const pathname = usePathname();

  const [tabValue, setTabValue] = useState<string>(tab ? tab : 'images');


  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    router.push(pathname + '?tab=' + newValue);
  };

  return (
    <div className="car-page">
      {data && carId &&
        <>
          <Header data={data} />
          <div className="tabs-container">
            <TabContext value={tabValue}>
              <Tabs
                value={tabValue}
                centered
                onChange={handleChange}
                aria-label="car page tabs"
                sx={{
                  ".Mui-selected": { color: `#b81111 !important`, },
                  ".MuiTabs-indicator": { backgroundColor: `#b81111 !important` },
                }}
              >
                <Tab value="images" sx={tabSx} icon={<PhotoLibraryIcon />} />
                <Tab value="info" sx={tabSx} icon={<InfoIcon />} />
                <Tab value="articles" sx={tabSx} icon={<ArticleIcon />} />
              </Tabs>
              <div
                className="tab-panel"
                style={{
                  display: tabValue === 'images' ? 'block' : 'none'
                }}
              >
                <ImageGallery ownerId={data.userId} carId={carId} />
              </div>
              <div
                style={{
                  display: tabValue === 'info' ? 'block' : 'none'
                }}
                className="tab-panel"
              >
                <InfoPanel data={data} />
              </div>
              <div
                className="tab-panel"
                style={{
                  display: tabValue === 'articles' ? 'block' : 'none'
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
