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

const onChangeNonStaggered = (type: string, name: string, e: any, setValue: any) => {
  e.preventDefault();
  setValue(`wheelTire.${type}.front.${name}`, e.target.value, { shouldDirty: true });
  setValue(`wheelTire.${type}.rear.${name}`, e.target.value, { shouldDirty: true });
}

const WheelFields = (
  { position, watch, setValue, control }:
    { position: string, watch: any, setValue: any, control: any }
) => {
  const pos = position === 'both' ? 'front' : position;
  return (
    <div className="flex flex-wrap gap-2 justify-start items-center">
      {position !== 'both' &&
        <span className="capitalize rounded-lg px-2 py-1 bg-gray-100 text-xs">
          {position}
        </span>
      }
      {/* {watch('wheelTire.wheel.isStock') &&
        <div className="form-wheel-disabled-overlay">
          <BlockIcon sx={{ opacity: 0.5 }} />
          <div>Not editable when stock wheels are selected</div>
        </div>
      } */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <FormTextField
            control={control}
            disabled={watch('wheelTire.wheel.isStock')}
            name={`wheelTire.wheel.${pos}.brand`}
            onChange={position === 'both' ? (e: any) => onChangeNonStaggered('wheel', 'brand', e, setValue) : null}
            label="Brand"
          />
          <FormTextField
            control={control}
            disabled={watch('wheelTire.wheel.isStock')}
            name={`wheelTire.wheel.${pos}.model`}
            onChange={position === 'both' ? (e: any) => onChangeNonStaggered('wheel', 'model', e, setValue) : null}
            label="Model"
          />
        </div>
        <div className="flex gap-1">
          <FormSelectField
            control={control}
            disabled={watch('wheelTire.wheel.isStock')}
            width={115}
            name={`wheelTire.wheel.${pos}.diameter`}
            onChange={position === 'both' ? (e: any) => onChangeNonStaggered('wheel', 'diameter', e, setValue) : null}
            label="Diameter"
            options={getWheelOptions(10, 24, 1)}
          />
          <FormSelectField
            control={control}
            disabled={watch('wheelTire.wheel.isStock')}
            width={110}
            name={`wheelTire.wheel.${pos}.width`}
            onChange={position === 'both' ? (e: any) => onChangeNonStaggered('wheel', 'width', e, setValue) : null}
            label="Width"
            options={getWheelOptions(4, 14, 0.5)}
          />
          <FormSelectField
            control={control}
            disabled={watch('wheelTire.wheel.isStock')}
            width={110}
            name={`wheelTire.wheel.${pos}.offset`}
            onChange={position === 'both' ? (e: any) => onChangeNonStaggered('wheel', 'offset', e, setValue) : null}
            label="Offset"
            options={getWheelOffsets()}
          />
        </div>
      </div>
    </div>
  );
}

const TireFields = (
  { position, watch, setValue, control }:
    { position: string, watch: any, setValue: any, control: any }
) => {
  const pos = position === 'both' ? 'front' : position;

  return (
    <div className="flex flex-wrap gap-3 justify-start items-center">
      {position !== 'both' &&
        <span className="capitalize rounded-lg px-2 py-1 bg-gray-100 text-xs">
          {position}
        </span>
      }
      {/* {watch('wheelTire.tire.isStock') &&
        <div className="form-wheel-disabled-overlay">
          <BlockIcon sx={{ opacity: 0.5 }} />
          <div>Not editable when stock tires are selected</div>
        </div>
      } */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <FormTextField
            control={control}
            disabled={watch('wheelTire.tire.isStock')}
            name={`wheelTire.tire.${pos}.brand`}
            onChange={position === 'both' ? (e: any) => onChangeNonStaggered('tire', 'brand', e, setValue) : null}
            label="Brand"
          />
          <FormTextField
            control={control}
            disabled={watch('wheelTire.tire.isStock')}
            name={`wheelTire.tire.${pos}.model`}
            onChange={position === 'both' ? (e: any) => onChangeNonStaggered('tire', 'model', e, setValue) : null}
            label="Model"
          />
        </div>
        <div className="flex gap-1">
          <FormTextField
            width={120}
            control={control}
            disabled={watch('wheelTire.tire.isStock')}
            name={`wheelTire.tire.${pos}.size`}
            onChange={position === 'both' ? (e: any) => onChangeNonStaggered('tire', 'size', e, setValue) : null}
            label="Size"
          />
        </div>
      </div>
    </div>
  );
}

const WheelForm = (
  { watch, control, setValue, handleOpenCropper } :
  { watch: any, control: any, setValue: any, handleOpenCropper: any }
) => {
  const isStaggered = watch('wheelTire.isStaggered');

  return (
    <div className="w-full bg-white shadow-lg rounded-md p-1">
      <div className="form-array-header">
        {/* <Chip
          avatar={<Image alt="wheel icon" height={24} width={24} src={wheelIcon} />}
          label="Wheels and Tires"
          sx={{ fontWeight: 'bold' }}
        /> */}
        <div className="category-title">
          <Image src="/wheel-icon-red.png" alt="Wheel icon" width={20} height={20} />
          <h3>Wheels & Tires</h3>
        </div>
        <div className="grow text-right">
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
      <div className="flex flex-col gap-2 px-4 py-2 items-start">
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
        <div className="flex gap-1">
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
              <Switch
                value={watch('wheelTire.isStaggered')}
                onChange={(e) => setValue('wheelTire.isStaggered', e.target.checked, { shouldDirty: true })}
              />
            }
            label="Staggered"
          />
        </div>

        {isStaggered ?
          <>
            <div>
              <div className="border-b border-solid border-red-800 font-bold text-red-800 px-2 py-1 text-sm mb-3">
                Wheels
              </div>
              <div className="flex flex-col gap-3">
                <WheelFields position="front" watch={watch} setValue={setValue} control={control} />
                <WheelFields position="rear" watch={watch} setValue={setValue} control={control} />
              </div>
            </div>
            <div>
              <div className="border-b border-solid border-red-800 font-bold text-red-800 px-2 py-1 text-sm mb-3">
                Tires
              </div>
              <div className="flex flex-col gap-3">
                <TireFields position="front" watch={watch} setValue={setValue} control={control} />
                <TireFields position="rear" watch={watch} setValue={setValue} control={control} />
              </div>
            </div>
          </> :
          <>
            <div>
              <div className="border-b border-solid border-red-800 font-bold text-red-800 px-2 py-1 text-sm mb-3">
                Wheels
              </div>
              <WheelFields position="both" watch={watch} setValue={setValue} control={control} />
            </div>
            <div>
              <div className="border-b border-solid border-red-800 font-bold text-red-800 px-2 py-1 text-sm mb-3">
                Tires
              </div>
              <TireFields position="both" watch={watch} setValue={setValue} control={control} />
            </div>
          </>
        }

      </div>
    </div>
  )
};

export default memo(WheelForm);
