"use client";

import React, { useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';

import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArticleIcon from '@mui/icons-material/Article';

import CarCardContainer from '@/components/carCard/carCardContainer';
import ArticlePanel from '@/components/carPage/articlePanel';

const tabSx = { backgroundColor: '#ffffffb4' };

const UserProfile = ({
  carList, username, userId
}: { carList: any[], username: string, userId: string }) => {

  const [value, setValue] = useState<string>('1');

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <div className="car-page">
      {carList && userId &&
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
              <Tab value="1" sx={tabSx} icon={<DirectionsCarIcon />} />
              <Tab value="2" sx={tabSx} icon={<ArticleIcon />} />
              <Tab value="3" sx={tabSx} icon={<PhotoLibraryIcon />} />
            </Tabs>
            <div
              className="tab-panel"
              style={{
                display: value === "1" ? 'block' : 'none'
              }}
            >
              <CarCardContainer carList={carList} />
            </div>
            <div
              style={{
                display: value === "2" ? 'block' : 'none'
              }}
              className="tab-panel"
            >
              {/* <ArticlePanel identifier={userId} isUserOwner={false} pageType="user" /> */}
            </div>
            <div
              className="tab-panel"
              style={{
                display: value === "3" ? 'block' : 'none'
              }}
            >
            </div>
          </TabContext>
        </div>
      }
    </div>
  )
};

export default UserProfile;
