"use client";

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { flatten } from "flat";
import _ from "lodash";

import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SaveIcon from "@mui/icons-material/Save";

import CarCard from "@/components/carCard/carCard";
import {
  FormTextField,
  FormSelectField,
  FormTagField,
  FormImageCropper,
} from "@/components/formComponents";
import * as carDataJson from "@/assets/carData.json";

import { WheelTire, Car, CarProps, CarCategoryKey, } from "@/lib/interfaces";
import { editCar, createCar } from "@/lib/firebase/car/carClient";

import WheelForm from "./wheelForm";
import { toTitleCase, toCamelCase } from "../utils";
import CategorySection from "./categorySection";
import { FIELD_ARRAYS, getIcon, getCategoryKeys } from "./fieldSettings";

import "./editPanel.scss";

const categoryKeys = getCategoryKeys();
// @ts-ignore
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

interface EditPanelProps {
  data: { [key: string]: any };
  isNewProfile?: boolean;
  carId: string;
  currentUserId: string;
}

const EditPanel = (
  { data, isNewProfile, carId, currentUserId }:
    EditPanelProps
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
  const handleSave = async (formValues: any, e: any) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.id !== "form-submit-btn") return;
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
        }
        // handle wheel tire fields
        else if (firstKey === 'wheelTire') {
          _.set(changes, key, _.get(formValues, key));
        }
        // handle other fields
        else {
          const formValue = _.get(formValues, key);
          changes[key] = formValue;
        }
      }
    };

    console.log('Saved changes:', changes);

    if (carId && !isNewProfile) {
      const res = await editCar(carId, changes, dirtyImages);
      if (res) redirect(`/car-profile/${carId}?tab=info`);
      else {
      }
    } else {
      const res = await createCar(changes, dirtyImages, currentUserId);
      if (res) redirect(`/car-profile/${res}?tab=info`);
    }
  };

  const handleErrors = () => {
    console.log('has errors', formState.errors, formState)
  }

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
  const selectedImageSplitName = selectedImagePreview ?
    selectedImagePreview.split(".") :
    [];

  return (
    <>
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
        {selectedImagePreview ?
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
            // Header={() => {
            //   if (selectedImagePreview) {
            //     const splitName = selectedImagePreview.split(".");
            //     const Icon = getIcon(splitName[0] === "thumbnails" ? splitName[1] : selectedImagePreview)
            //     const label = splitName[0] === "thumbnails" ?
            //       `Edit ${toTitleCase(splitName[1])} Thumbnail` : "Edit Preview Image";
            //     if (Icon)
            //       return (
            //         <div>
            //           <Icon />
            //         </div>
            //       );
            //   } else return <></>
            // }}
            HeaderIcon={getIcon(
              selectedImageSplitName[0] === "thumbnails" ? selectedImageSplitName[1] : selectedImagePreview
            )}
            headerText={selectedImageSplitName[0] === "thumbnails" ?
              `${toTitleCase(selectedImageSplitName[1])} Thumbnail` :
              "Preview Image"
            }
          />
          : <div></div>}
      </Modal>
      <div className="form-container">
        <form className="form relative" onSubmit={handleSubmit(handleSave, handleErrors)}>
          <h2>
            {isNewProfile ? "New Car Profile" : "Edit Car Profile"}
          </h2>
          <div className="p-2 bg-white rounded-lg shadow-lg w-full">
            <div className="form-array-header">
              <div className="category-title">
                <DirectionsCarIcon /> <h3>Car Info</h3>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-4">
              <div className="flex flex-col items-start gap-1">
                <CarCard
                  disableLink
                  disableFooter
                  isSmallCard
                  data={watch()}
                />
                <Button
                  size="small"
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}

                  startIcon={watch(`previewImage`) ?
                    <PhotoSizeSelectLargeIcon /> : <AddPhotoAlternateIcon />
                  }
                  onClick={() => {
                    setImageModal(true);
                    setSelectedImagePreview(`previewImage`);
                  }}
                >
                  {watch(`previewImage`) ?
                    "Update Thumbnail Image" : "Upload Thumbnail Image"
                  }
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 my-4">
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
                <FormTextField
                  isOnBlur
                  control={control}
                  name="description"
                  width={350}
                  multiline
                  label="Description"
                />
              </div>

              {/* <div className="category-title">
            <LocalOfferIcon /> <h3>Tags</h3>
          </div> */}
              <FormTagField control={control} name="tags" label="Tags" />
            </div>
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
              id="form-submit-btn"
              size="small"
              variant="contained"
              disabled={!formState.isDirty}
              sx={{ textTransform: "capitalize" }}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
            <Button
              onClick={() => reset()}
              size="small"
              variant="outlined"
              sx={{ textTransform: "capitalize" }}
            >
              Reset
            </Button>
            <Link href={isNewProfile ?
              `/user-profile/${currentUserId}` :
              `/car-profile/${carId}?tab=info`
            }
            >
              <Button size="small" sx={{ textTransform: "capitalize" }}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditPanel;
