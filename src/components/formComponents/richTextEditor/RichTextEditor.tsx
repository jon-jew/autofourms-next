"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Controller } from "react-hook-form";

import Editor from './Editor';
import 'quill/dist/quill.snow.css'; // import styles for the editor

function resizeImage(image: any) {
  var canvas = document.createElement('canvas');
  var maxWidth = 400;
  var maxHeight = 300;
  var width = image.width;
  var height = image.height;

  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }
  }

  canvas.width = width;
  canvas.height = height;

  var ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(image, 0, 0, width, height);
  }

  return canvas.toDataURL();
}

const FormRichTextEditor = (
  { name, control }:
    { name: string, control: any }
) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <Editor value={value} onChange={onChange} />
      )}
    />
  )
};

export default FormRichTextEditor;
