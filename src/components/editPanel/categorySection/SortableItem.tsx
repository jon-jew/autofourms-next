'use client';
import clx from "classnames";
import IconButton from '@mui/material/IconButton';

import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  FormAutoComplete,
  FormTextField,
  FormSelectField,
} from "@/components/formComponents";

const SortableItem = ({
  categoryName,
  index,
  isAutoComplete,
  control,
  setValue,
  options,
  optionObject,
  remove,
  valueFieldType,
  item,
  deleteMode,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      key={item.id}
      className="flex bg-gray-100 shadow-md rounded-lg overflow-hidden w-full"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <button
        className="flex justify-center items-center w-[25px] bg-sky-200 text-sky-500 hover:bg-sky-300 hover:text-sky-600"
        {...listeners}
      >
        <DragIndicatorIcon />
      </button>
      <div className="flex justify-start items-center flex-wrap p-2 gap-2 w-full">
        {isAutoComplete ?
          <FormAutoComplete
            isOnBlur
            control={control}
            // disableOption={(option) => activeCatagories.includes(option.label)}
            name={`${categoryName}.${index}.label` as const}
            freeSolo={isAutoComplete}
            width={220}
            label={`Item`}
            onChange={() => setValue(`${categoryName}.${index}.value`, "")}
            options={options}
          />
          :
          <FormSelectField
            control={control}
            // disableOption={(option) => activeCatagories.includes(option.label)}
            name={`${categoryName}.${index}.label` as const}
            freeSolo={isAutoComplete}
            width={115}
            label={`Item`}
            onChange={() => setValue(`${categoryName}.${index}.value`, "")}
            options={options.map((option) => option.label)}
          />

        }
        {/* {isAutoComplete &&
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
          </div>
        } */}
        <div className="grow">
          {valueFieldType === "select" ?
            <FormSelectField
              control={control}
              name={`${categoryName}.${index}.value` as const}
              label="Value"
              options={optionObject.options}
            /> :
            <FormTextField
              isOnBlur
              rules={{ required: true }}
              control={control}
              name={`${categoryName}.${index}.value` as const}
              // width={isAutoComplete ? 340 : 145}
              multiline
              fullWidth
              label="Value"
            />
          }
        </div>
      </div>
      <div className={
        clx({
          "flex justify-center items-center grow": true,
          "hidden": !deleteMode
        })
      }>
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
};

export default SortableItem;
