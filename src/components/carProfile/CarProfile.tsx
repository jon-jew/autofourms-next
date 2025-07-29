'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';

import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';

import { Article } from '@/lib/interfaces';
import Header from '@/components/carProfile/header';
import ImageGallery from '@/components/carProfile/imageGallery';
import InfoPanel from '@/components/carProfile/infoPanel';
import ArticlePanel from '@/components/carProfile/articlePanel';

import './carProfile.scss';

const tabSx = { backgroundColor: '#ffffffb4' };

export default function CarProfile({
  carId,
  data,
  images,
  tab,
  currentUserId,
  articles,
}: {
  carId: string,
  data: { [key: string]: any },
  images?: string[],
  tab?: string,
  currentUserId: string | undefined,
  articles: Article[],
}) {

  const router = useRouter();
  const pathname = usePathname();

  const [tabValue, setTabValue] = useState<string>(tab ? tab : 'images');
  const isUserOwner = currentUserId === data.userId;

  const handleChange = (event: any, newValue: string) => {
    setTabValue(newValue);
    router.push(pathname + '?tab=' + newValue);
  };

  return (
    <div className="car-page">
      {data && carId &&
        <>
          <Header
            data={data}
            currentUserId={currentUserId}
            isUserOwner={isUserOwner}
          />
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
                <ImageGallery ownerId={data.userId} carId={carId} currentUserId={currentUserId}/>
              </div>
              <div
                style={{
                  display: tabValue === 'info' ? 'block' : 'none'
                }}
                className="tab-panel"
              >
                <InfoPanel isUserOwner={isUserOwner} data={data} />
              </div>
              <div
                className="tab-panel"
                style={{
                  display: tabValue === 'articles' ? 'block' : 'none'
                }}
              >
                <ArticlePanel
                  isUserOwner={isUserOwner}
                  identifier={carId}
                  articles={articles}
                  pageType="car"
                />
              </div>
            </TabContext>
          </div>
        </>}
    </div>
  );
}
