import React, { useState } from 'react';

import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';

const tabSx = { backgroundColor: '#ffffffb4' };

const ProfileHeader = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div>
      <TabContext value={value}>
        <Tabs
          value={value}
          centered
          onChange={handleChange}
          aria-label="car page tabs"
        >
          <Tab value="1" sx={tabSx} icon={<PhotoLibraryIcon />} />
          <Tab value="2" sx={tabSx} icon={<InfoIcon />} />
          <Tab value="3" sx={tabSx} icon={<ArticleIcon />} />
        </Tabs>
        <TabPanel sx={{ overflowY: 'scroll', height: 'calc(100% - 100px)' }} value="1">
          Test
        </TabPanel>
        <TabPanel value="2">
          Test
        </TabPanel>
        <TabPanel value="3">
          Item Three
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default ProfileHeader;
