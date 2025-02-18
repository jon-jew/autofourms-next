import React, { memo } from 'react';
import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import PhotoSizeSelectLargeIcon from '@mui/icons-material/PhotoSizeSelectLarge';
import PushPinIcon from '@mui/icons-material/PushPin';
import HideImageIcon from '@mui/icons-material/HideImage';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import BlockIcon from '@mui/icons-material/Block';

import { FormTextField, FormSelectField } from '../formComponents';

import { getWheelOptions, getWheelOffsets } from '../utils';
import './editPanel.scss';

import wheelIcon from '../../assets/wheelIcon.png';

const onChangeNonStaggered = (type, name, e, setValue) => {
  e.preventDefault();
  setValue(`wheelTire.${type}.front.${name}`, e.target.value, { shouldDirty: true });
  setValue(`wheelTire.${type}.rear.${name}`, e.target.value, { shouldDirty: true });
}

const WheelFields = ({ position, watch, setValue, control }) => {
  const pos = position === 'both' ? 'front' : position;
  return (
    <div className="form-wheel-category">
      <span>{position !== 'both' && position}</span>
      {/* {watch('wheelTire.wheel.isStock') &&
        <div className="form-wheel-disabled-overlay">
          <BlockIcon sx={{ opacity: 0.5 }} />
          <div>Not editable when stock wheels are selected</div>
        </div>
      } */}
      <div className="form-wheel-row">
        <FormTextField
          control={control}
          disabled={watch('wheelTire.wheel.isStock')}
          name={`wheelTire.wheel.${pos}.brand`}
          onChange={position === 'both' ? (e) => onChangeNonStaggered('wheel', 'brand', e, setValue) : null}
          label="Wheel Brand"
        />
        <FormTextField
          control={control}
          disabled={watch('wheelTire.wheel.isStock')}
          name={`wheelTire.wheel.${pos}.model`}
          onChange={position === 'both' ? (e) => onChangeNonStaggered('wheel', 'model', e, setValue) : null}
          label="Wheel Model"
        />
      </div>
      <div className="form-wheel-row">
        <FormSelectField
          control={control}
          disabled={watch('wheelTire.wheel.isStock')}
          width={115}
          name={`wheelTire.wheel.${pos}.diameter`}
          onChange={position === 'both' ? (e) => onChangeNonStaggered('wheel', 'diameter', e, setValue) : null}
          label="Wheel Diameter"
          options={getWheelOptions(10, 24, 1)}
        />
        <FormSelectField
          control={control}
          disabled={watch('wheelTire.wheel.isStock')}
          width={110}
          name={`wheelTire.wheel.${pos}.width`}
          onChange={position === 'both' ? (e) => onChangeNonStaggered('wheel', 'width', e, setValue) : null}
          label="Wheel Width"
          options={getWheelOptions(4, 14, 0.5)}
        />
        <FormSelectField
          control={control}
          disabled={watch('wheelTire.wheel.isStock')}
          width={110}
          name={`wheelTire.wheel.${pos}.offset`}
          onChange={position === 'both' ? (e) => onChangeNonStaggered('wheel', 'offset', e, setValue) : null}
          label="Wheel Offset"
          options={getWheelOffsets()}
        />
      </div>
    </div>
  );
}

const TireFields = ({ position, watch, setValue, control }) => {
  const pos = position === 'both' ? 'front' : position;

  return (
    <div className="form-wheel-category">
      <span>{position !== 'both' && position}</span>

      {/* {watch('wheelTire.tire.isStock') &&
        <div className="form-wheel-disabled-overlay">
          <BlockIcon sx={{ opacity: 0.5 }} />
          <div>Not editable when stock tires are selected</div>
        </div>
      } */}
      <div className="form-wheel-row">
        <FormTextField
          control={control}
          disabled={watch('wheelTire.tire.isStock')}
          name={`wheelTire.tire.${pos}.brand`}
          onChange={position === 'both' ? (e) => onChangeNonStaggered('tire', 'brand', e, setValue) : null}
          label="Tire Brand"
        />
        <FormTextField
          control={control}
          disabled={watch('wheelTire.tire.isStock')}
          name={`wheelTire.tire.${pos}.model`}
          onChange={position === 'both' ? (e) => onChangeNonStaggered('tire', 'model', e, setValue) : null}
          label="Tire Model"
        />
      </div>
      <div className="form-wheel-row">
        <FormTextField
          width={120}
          control={control}
          disabled={watch('wheelTire.tire.isStock')}
          name={`wheelTire.tire.${pos}.size`}
          onChange={position === 'both' ? (e) => onChangeNonStaggered('tire', 'size', e, setValue) : null}
          label="Tire Size"
        />
      </div>
    </div>
  );
}

const WheelForm = ({ watch, control, setValue, handleOpenCropper }) => {
  const isStaggered = watch('wheelTire.isStaggered');

  return (
    <div className="form-wheel-container">
      <div className="form-array-header">
        <Chip
          avatar={<Image alt="wheel icon" height={24} width={24} src={wheelIcon} />}
          label="Wheels and Tires"
          sx={{ fontWeight: 'bold' }}
        />
        <div className="form-array-top-buttons">
          {watch(`thumbnails.wheels`) &&
            <Tooltip title="Remove thumbnail image">
              <IconButton
                size="small"
                onClick={() => setValue(`thumbnails.wheels`, null, { shouldDirty: true })}
              >
                <HideImageIcon />
              </IconButton>
            </Tooltip>
          }
          <Tooltip title={watch('thumbnails.wheels') ? 'Edit thumbnail image' : 'Add thumbnail image'}>
            <IconButton size="small" onClick={() => handleOpenCropper('thumbnails.wheels')}>
              {watch('thumbnails.wheels') ?
                <PhotoSizeSelectLargeIcon /> : <AddPhotoAlternateIcon />
              }
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="form-wheel-fields-container">
        {watch('thumbnails.wheels') &&
          <div className="form-thumbnail-container">
            <Chip sx={{ position: 'absolute', top: '10px' }} color="primary" icon={<PushPinIcon />} size="small" label="Thumbnail" />
            <Image
              src={watch('thumbnails.wheels')}
              alt="Wheels thumbnail"
              width={250}
              height={166}
            />
          </div>
        }
        <div className="form-wheel-switch-container">
          {/* <FormControlLabel
            control={
              <Switch onChange={(e) => setValue('wheelTire.wheel.isStock', e.target.checked, { shouldDirty: true })} />
            }
            label="Stock Wheels"
          />
          <FormControlLabel
            sx={{ fontSize: 10 }}
            control={
              <Switch onChange={(e) => setValue('wheelTire.tire.isStock', e.target.checked, { shouldDirty: true })} />
            }
            label="Stock Tires"
          /> */}
          <FormControlLabel
            sx={{ fontSize: 10 }}
            control={
              <Switch onChange={(e) => setValue('wheelTire.isStaggered', e.target.checked, { shouldDirty: true })} />
            }
            label="Staggered"
          />
        </div>

        {isStaggered ?
          <>
            <WheelFields position="front" watch={watch} setValue={setValue} control={control} />
            <WheelFields position="rear" watch={watch} setValue={setValue} control={control} />
            <TireFields position="front" watch={watch} setValue={setValue} control={control} />
            <TireFields position="rear" watch={watch} setValue={setValue} control={control} />
          </> :
          <>
            <WheelFields position="both" watch={watch} setValue={setValue} control={control} />
            <TireFields position="both" watch={watch} setValue={setValue} control={control} />
          </>
        }

      </div>
    </div>
  )
};

export default memo(WheelForm);