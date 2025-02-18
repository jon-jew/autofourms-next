"use client";

import React, { useState, memo } from 'react';
import clx from "classnames";
import Image from 'next/image';
import { useForm, useFieldArray } from "react-hook-form"

import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import HideImageIcon from "@mui/icons-material/HideImage";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  FormAutoComplete,
  FormTextField,
  FormSelectField,
} from "@/components/formComponents";

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

const PositionMoveButtons = ({
  index, name, setMovedField, swap, fields
}: {
  index: number, name: string, setMovedField: any, swap: Function, fields: any[]
}) => (
  <div className="form-array-button-container">
    {index !== 0 ?
      <button
        className="order-button up"
        onClick={(e) => {
          e.preventDefault();
          swap(index, index - 1);
          setMovedField(`${name}.${index - 1}`);
          setTimeout(() => setMovedField(null), 250);
        }}
      >
        <ArrowUpwardIcon sx={{ fontSize: "15px" }} />
      </button> :
      <div className="button-placeholder" />
    }
    {index !== fields.length - 1 ?
      <button
        className="order-button down"
        disabled={index === fields.length - 1}
        onClick={(e) => {
          e.preventDefault();
          swap(index, index + 1)
          setMovedField(`${name}.${index + 1}`);
          setTimeout(() => setMovedField(null), 250);
        }}
      >
        <ArrowDownwardIcon sx={{ fontSize: "15px" }} />
      </button> :
      <div className="button-placeholder" />
    }
  </div>
);

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
  const { fields, append, remove, swap, } = useFieldArray({ control, name: categoryName })
  const [movedField, setMovedField] = useState<string | null>(null);

  return (
    <div className="form-array-container">
      <div className="form-array-header">
        <Chip
          avatar={icon}
          label={categoryTitle}
          sx={{ fontWeight: "bold" }}
        />
        <div className="form-array-top-buttons">
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
          <Tooltip title="Add new entry">
            <IconButton size="small" onClick={() =>
              append({ label: "", value: "" })
            }>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="form-array-body">
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
          fields.map((item, index) => {
            // const activeCatagories = watch(categoryName).map((category) => category ? category.label : null);
            const labelValue = watch(`${categoryName}.${index}.label`);
            const optionObject = options.find((option) => option.label === labelValue);
            const valueFieldType = optionObject ? optionObject.type : "text";

            return (
              <div
                className={clx({
                  "form-row-odd": index % 2 !== 0,
                  "form-row-even": index % 2 === 0,
                  "form-array-row": true,
                  "form-array-row-selected": `${categoryName}.${index}` === movedField
                })}
                key={item.id}
              >
                <div className={clx({
                  "hidden-sm-down": isAutoComplete,
                })}>
                  <PositionMoveButtons
                    index={index}
                    name={categoryName}
                    setMovedField={setMovedField}
                    swap={swap}
                    fields={fields}
                  />
                </div>
                {isAutoComplete ?
                  <FormAutoComplete
                    isOnBlur
                    control={control}
                    // disableOption={(option) => activeCatagories.includes(option.label)}
                    name={`${categoryName}.${index}.label`}
                    freeSolo={isAutoComplete}
                    width={220}
                    label={`Category ${index + 1}`}
                    onChange={() => setValue(`${categoryName}.${index}.value`, "")}
                    options={options}
                  />
                  :
                  <FormSelectField
                    control={control}
                    // disableOption={(option) => activeCatagories.includes(option.label)}
                    name={`${categoryName}.${index}.label`}
                    freeSolo={isAutoComplete}
                    width={115}
                    label={`Category ${index + 1}`}
                    onChange={() => setValue(`${categoryName}.${index}.value`, "")}
                    options={options.map((option) => option.label)}
                  />

                }
                {isAutoComplete &&
                  <div className="sm-controls-container hidden-sm-up">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setValue(`${categoryName}.${index}.value`, "");
                        setValue(`${categoryName}.${index}.label`, "")
                        remove(index);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <PositionMoveButtons
                      index={index}
                      name={categoryName}
                      setMovedField={setMovedField}
                      swap={swap}
                      fields={fields}
                    />
                  </div>
                }
                {valueFieldType === "select" ?
                  <FormSelectField
                    control={control}
                    name={`${categoryName}.${index}.value`}
                    label="Value"
                    options={optionObject.options}
                  /> :
                  <FormTextField
                    isOnBlur
                    control={control}
                    name={`${categoryName}.${index}.value`}
                    width={isAutoComplete ? 340 : 145}
                    label="Value"
                  />
                }
                <div className={clx({
                  "form-array-end-container": true,
                  "hidden-sm-down": isAutoComplete,
                })}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setValue(`${categoryName}.${index}.value`, "");
                      setValue(`${categoryName}.${index}.label`, "")
                      remove(index);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            );
          }) :
          <div className="no-entries-container">
            <HighlightOffIcon sx={{ opacity: 0.5 }} />
            <span>No Entries</span>
          </div>}
      </div>
    </div>
  )
};

export default memo(CategorySection);
