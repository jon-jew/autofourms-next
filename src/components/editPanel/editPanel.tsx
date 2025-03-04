"use client";

import React, { useState, useEffect } from "react";
import clx from "classnames";
import { useForm, useFieldArray, set } from "react-hook-form";
import { flatten } from "flat";
import _ from "lodash";

import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import HideImageIcon from "@mui/icons-material/HideImage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SaveIcon from "@mui/icons-material/Save";
import ImageIcon from "@mui/icons-material/Image";

import CarCard from "@/components/carCard/carCard";
import { toTitleCase, toCamelCase, } from "../utils";
import {
  FormAutoComplete,
  FormTextField,
  FormSelectField,
  FormRichTextEditor,
  FormTagField,
  FormImageCropper,
} from "@/components/formComponents";
import * as carDataJson from "../../assets/carData.json";

import WheelForm from "./wheelForm";
import CategorySection from "./categorySection";
import { FIELD_ARRAYS, getIcon } from "./fieldSettings";
import "./editPanel.scss";
import Link from "next/link";
import { WheelTire, Car, CarProps, CarCategoryKey, } from "@/lib/interfaces";
import { getCategoryKeys } from "./fieldSettings";

const categoryKeys = getCategoryKeys();
const carData = carDataJson.default;
const carMakeOptions = carData.map((make: { make: string }) => make.make);

const basicFormKeys = ["modelYear", "make", "model", "description", "previewImage"] as const;

type BasicFormKeys = { [key in typeof basicFormKeys[number]]: string };
type CarCategoryProps = {
  [key in CarCategoryKey]?:
  { label: string, value: string }[];
};
type EntryType = {
  [key: string]: {
    value: string;
    order?: number;
  };
};
interface CarFormValues extends CarCategoryProps, BasicFormKeys {
  submodel?: string;
  tags: string[];
  thumbnails: { [key in CarCategoryKey]: string };
  wheelTire: WheelTire;
};
interface FormCategory {
  name: string;
  icon: React.JSX.Element;
  title: string;
  isAutoComplete: boolean;
  options: { label: string; type: string }[];
};
interface CarModel {
  model: string;
  submodels: { submodel: string; picture: string; }[];
};
interface CarMake {
  make: string;
  models: {
    model: string;
    submodels: { submodel: string; }[]
  };
};

const transformData = (data: { [key: string]: any }) => {
  const newData: { [key: string]: any } = {
    modelYear: data.modelYear,
    make: data.make,
    model: data.model,
    submodel: data.submodel,
    description: data.description,
    tags: data.tags,
    previewImage: data.previewImage,
    thumbnails: data.thumbnails,
    wheelTire: data.wheelTire,
  };

  Object.keys(data).forEach((key) => {
    if (categoryKeys.includes(key) && data.hasOwnProperty(key)) {
      newData[key as keyof CarCategoryProps] = [];
      const category: { [key: string]: EntryType } = data[key as keyof CarProps];
      const categoryEntires = Object.keys(category).map((entryKey) => {
        return {
          order: category[entryKey].order,
          label: entryKey,
          value: category[entryKey].value,
        };
      });
      const sortedEntries = _.sortBy(categoryEntires, (entry) => entry.order);
      sortedEntries.forEach((entry) => {
        newData[key as keyof CarCategoryProps]?.push({
          label: toTitleCase(entry.label),
          value: entry.value,
        })
      });
    }
  });
  return newData;
};

const getCarMakeObject = (makeValue: string) => _.find(carData, (make: CarMake) => make.make === makeValue);

const getCarModelObject = (models: CarModel[], modelName: string) => _.find(models, (model) => model.model === modelName);

const getCarModelsByMake = (makeValue: string) => {
  const makeObject = getCarMakeObject(makeValue);
  if (makeObject) {
    return makeObject.models.map((model: CarModel) => model.model);
  }
  return [];
};

const EditPanel = (
  { data, onSave, isNewProfile, carId }:
    { data: { [key: string]: any }, onSave: Function, isNewProfile?: boolean, carId: string }
) => {
  const [carModelOptions, setCarModelOptions] = useState<string[]>([]);
  const [carSubmodelOptions, setCarSubmodelOptions] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState(null);
  // const [open, setOpen] = useState(false);
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);


  const handleModelChange = (makeValue: string, modelValue: string) => {
    const makeObject = getCarMakeObject(makeValue);
    if (makeObject) {
      const modelObject = getCarModelObject(makeObject.models, modelValue);
      if (modelObject) {
        setCarSubmodelOptions(modelObject.submodels.map((submodel) => submodel.submodel));
      }
    }
  };

  const handleOpenCropper = (name: string) => {
    setImageModal(true);
    setSelectedImagePreview(name);
  };

  const handleImageModalClose = () => {
    setImageModal(false);
  };

  useEffect(() => {
    const makeObject = getCarMakeObject(data.make);
    if (makeObject) {
      setCarModelOptions(makeObject.models.map((model: CarModel) => model.model));
      const modelObject = getCarModelObject(makeObject.models, data.model);
      if (modelObject) {
        setCarSubmodelOptions(modelObject.submodels.map((submodel) => submodel.submodel));
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState,
    setValue,
    reset,
    control,
  } = useForm({
    defaultValues: transformData(data),
  });

  const handleSave = async (formValues: CarFormValues) => {
    const imageKeys = ["thumbnails", "previewImage"];
    const flatDirtyFields: { [key: string]: boolean } = flatten(formState.dirtyFields);
    const dirtyImages: { name: string, value: string }[] = [];
    const changes: { [key: string]: any } = {};

    // get changes from dirty fields
    for (const [key, value] of Object.entries(flatDirtyFields)) {
      if (value) {
        const splitKey = key.split(".");
        const firstKey = splitKey[0];
        // handle category entry changes
        if (categoryKeys.includes(firstKey)) {
          const category = _.get(formValues, firstKey);
          if (Array.isArray(category)) {
            category.forEach(({ label, value }: { label: string, value: string }, idx) => {
              changes[firstKey] = {
                ...changes[firstKey],
                [toCamelCase(label)]: { value, order: idx },
              };
            });
          }
          // handle image changes
        } else if (imageKeys.includes(firstKey)) {
          const imageValue = _.get(formValues, key);
          dirtyImages.push({
            name: key,
            value: imageValue,
          });
          // handle other fields
        } else {
          const formValue = _.get(formValues, key);
          changes[key] = formValue;
        }
      }
    };
    console.log(changes);

    onSave(changes, dirtyImages);
  };

  const onMakeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const modelList = getCarModelsByMake(event.target.value)
    setCarModelOptions(modelList);
    setValue("make", event.target.value);
    setValue("model", "");
    setValue("submodel", "");
  };
  const onModelChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    handleModelChange(watch("make"), event.target.value);
    setValue("model", event.target.value);
    setValue("submodel", "");
  };

  const fieldArrays: FormCategory[] = FIELD_ARRAYS;

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit(handleSave)}>
        <h2>
          {isNewProfile ? "New Car Profile" : "Edit Car Profile"}
        </h2>

        {/* <Modal open={open} onClose={handleClose}>
          <>
            {selectedField !== null &&
              <div className="form-details-modal">
                <div className="details-modal-header">
                  {selectedField.title}
                </div>
                <FormRichTextEditor name={`${selectedField.name}.details`} control={control} />
              </div>
            }
          </>
        </Modal> */}
        <Modal open={imageModal} onClose={handleImageModalClose}>
          <div>
            <FormImageCropper
              onChange={(croppedImg: string) => {
                if (selectedImagePreview)
                  setValue(selectedImagePreview, croppedImg, { shouldDirty: true });
                setImageModal(false);
              }}
              onClose={() => {
                setImageModal(false);
                setSelectedImagePreview(null);
              }}
              aspectRatio={3 / 2}
              imageSize={[600, 400]}
              hasCaption={false}
              initialImgSrc={selectedImagePreview ? getValues(selectedImagePreview) : null}
              Header={() => {
                if (selectedImagePreview) {
                  const splitName = selectedImagePreview.split(".");
                  const icon = getIcon(splitName[0] === "thumbnails" ? splitName[1] : selectedImagePreview)
                  const label = splitName[0] === "thumbnails" ?
                    `Edit ${toTitleCase(splitName[1])} Thumbnail` : "Edit Preview Image";
                  return <Chip avatar={icon} sx={{ fontWeight: "bold" }} label={label} />
                } else return <></>
              }}
            />
          </div>
        </Modal>
        <div style={{ width: "100%" }}>
          <Chip icon={<DirectionsCarIcon />} label="Car Info" sx={{ marginLeft: 0.5, marginBottom: 1, fontWeight: "bold" }} />
          <div className="form-make-model-container">
            <FormTextField
              isOnBlur
              control={control}
              name="modelYear"
              width={90}
              label="Model Year"
            />
            <FormSelectField
              control={control}
              name="make"
              label="Make"
              width={120}
              options={carMakeOptions}
              onChange={onMakeChange}
            />
            <FormSelectField
              control={control}
              name="model"
              disabled={!watch("make")}
              width={120}
              label="Model"
              options={carModelOptions}
              onChange={onModelChange}
            />
            {carSubmodelOptions.length > 0 ?
              <FormSelectField control={control} name="submodel" label="Submodel" options={carSubmodelOptions} />
              :
              <FormTextField isOnBlur control={control} name="submodel" label="Submodel" />
            }

          </div>
          <FormTextField
            isOnBlur
            control={control}
            name="description"
            width={350}
            multiline
            label="Description"
          />
        </div>
        <div className="preview-container">
          <div className="form-array-header">
            <Chip sx={{ fontWeight: "bold" }} label="Preview Image" icon={<ImageIcon />} />
            <div className="form-array-top-buttons">
              <Tooltip title={watch(`previewImage`) ? "Edit preview image" : "Add preview image"}>
                <IconButton size="small" onClick={() => {
                  setImageModal(true);
                  setSelectedImagePreview(`previewImage`);
                }}>
                  {watch(`previewImage`) ?
                    <PhotoSizeSelectLargeIcon /> : <AddPhotoAlternateIcon />
                  }
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <CarCard
            disableLink
            disableFooter
            isSmallCard
            data={watch()}
          />
        </div>

        <div className="form-tags-container">
          <Chip
            avatar={<LocalOfferIcon />}
            label="Tags"
            sx={{ marginLeft: 0.5, marginBottom: 0.5, fontWeight: "bold" }}
          />
          <FormTagField control={control} name="tags" label="Tags" />
        </div>
        <WheelForm
          watch={watch}
          control={control}
          setValue={setValue}
          handleOpenCropper={handleOpenCropper}
        />

        {fieldArrays.map(({ name, icon, title, options, isAutoComplete }) =>
          <CategorySection
            key={name}
            categoryName={name}
            categoryTitle={title}
            icon={icon}
            isAutoComplete={isAutoComplete}
            options={options}
            watch={watch}
            setValue={setValue}
            control={control}
            handleOpenCropper={handleOpenCropper}
          />
        )}
        <div className="form-footer">
          <Button
            type="submit"
            size="small"
            variant="contained"
            sx={{ textTransform: "capitalize" }}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
          {/* <Button
            onClick={() => reset()}
            size="small"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          >
            Reset Changes
          </Button> */}
          <Link href={`/car-profile/${carId}?tab=2`}>
            <Button size="small" sx={{ textTransform: "capitalize" }}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditPanel;
