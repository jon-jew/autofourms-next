"use client";

import React, { useState, memo } from 'react';
import clx from "classnames";
import Image from 'next/image';
import { useForm, useFieldArray } from "react-hook-form"

import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import HideImageIcon from "@mui/icons-material/HideImage";

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import AddIcon from "@mui/icons-material/Add";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import SortableItem from './SortableItem';

interface FormCategory {
  categoryName: string;
  categoryTitle: string;
  icon: React.JSX.Element;
  isAutoComplete: boolean;
  watch: Function;
  setValue: Function;
  control: any;
  handleOpenCropper: any;
  options: {
    label: string;
    type: string;
    options?: string[];
  }[];
};

const CategorySection = ({
  categoryName,
  categoryTitle,
  icon,
  isAutoComplete,
  options,
  watch,
  setValue,
  control,
  handleOpenCropper,
}: FormCategory) => {
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const { fields, append, remove, swap, } = useFieldArray({
    control,
    name: categoryName,
    rules: { required: true }
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      swap(active.data.current.sortable.index, over.data.current.sortable.index)
    }
  };

  return (
    <div className="w-full bg-white rounded-md p-2 shadow-lg">
      <div className="form-array-header">
        <div className="category-title">
          {icon} <h3>{categoryTitle}</h3>
        </div>
        <div className="grow text-right">
          {watch(`thumbnails.${categoryName}`) &&
            <Tooltip title="Remove thumbnail image">
              <IconButton
                size="small"
                onClick={() => setValue(`thumbnails.${categoryName}`, null, { shouldDirty: true })}
              >
                <HideImageIcon />
              </IconButton>
            </Tooltip>
          }
          <Tooltip title={watch(`thumbnails.${categoryName}`) ? "Edit thumbnail image" : "Add thumbnail image"}>
            <IconButton size="small" onClick={() => handleOpenCropper(`thumbnails.${categoryName}`)}>
              {watch(`thumbnails.${categoryName}`) ?
                <PhotoSizeSelectLargeIcon /> : <AddPhotoAlternateIcon />
              }
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove entries">
            <IconButton className="ml-3" size="small" onClick={() =>
              setDeleteMode(!deleteMode)
            }>
              {deleteMode ? <DeleteSweepOutlinedIcon /> : <DeleteSweepIcon /> }
            </IconButton>
          </Tooltip>
          <Tooltip title="Add new entry">
            <IconButton size="small" onClick={() =>
              append({ label: "", value: "" })
            }>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col p-2">
        {watch(`thumbnails.${categoryName}`) &&
          <div className="form-thumbnail-container">
            <Chip sx={{ position: "absolute", top: "10px" }} color="primary" icon={<PushPinIcon />} size="small" label="Thumbnail" />
            <Image
              src={watch(`thumbnails.${categoryName}`)}
              alt={`${categoryName} Thumbnail Preview`}
              width={250}
              height={166}
            />
          </div>
        }

        {fields.length > 0 ?
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3 items-start mt-2">
                {fields.map((item, index) => {
                  // const activeCatagories = watch(categoryName).map((category) => category ? category.label : null);
                  const labelValue = watch(`${categoryName}.${index}.label`);
                  const optionObject = options.find((option) => option.label === labelValue);
                  const valueFieldType = optionObject ? optionObject.type : "text";

                  return (
                    <SortableItem
                      key={item.id}
                      categoryName={categoryName}
                      index={index}
                      isAutoComplete={isAutoComplete}
                      control={control}
                      setValue={setValue}
                      options={options}
                      optionObject={optionObject}
                      valueFieldType={valueFieldType}
                      remove={remove}
                      item={item}
                      deleteMode={deleteMode}
                    />
                  )
                })}
              </div>
            </SortableContext>
          </DndContext> :
          <div className="no-entries-container">
            <HighlightOffIcon sx={{ opacity: 0.5 }} />
            <span>No Entries</span>
          </div>}
      </div>
    </div>
  );
};

export default memo(CategorySection);
