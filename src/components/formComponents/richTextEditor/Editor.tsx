"use client";

import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { Controller } from "react-hook-form";

import Quill from 'quill';
import { useQuill } from 'react-quilljs';
import dynamic from 'next/dynamic';

import 'quill/dist/quill.snow.css'; // import styles for the editor
interface PropsType {
  readOnly?: boolean;
  defaultValue?: any;
  onTextChange?: any;
  onSelectionChange?: any;
};

import "./editor.scss";


// Editor is an uncontrolled React component
const Editor = (
  { value, onChange }:
    { value: string, onChange: Function }
) => {
  const { quill, quillRef } = useQuill();
  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill])

  return (
    <div ref={quillRef} />
  )
};

export default Editor;
