"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Controller } from "react-hook-form";
import dynamic from 'next/dynamic';
import Quill from 'quill';

import Editor from './Editor';


// import {
//   EditorState,
//   RichUtils,
//   convertToRaw,
//   ContentState,
//   Modifier,
//   convertFromRaw,
//   convertFromHTML,
// } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
// import { Editor } from 'react-draft-wysiwyg';
// import { EditorProps } from 'react-draft-wysiwyg'
// const htmlToDraft = dynamic(() => import('html-to-draftjs').then(mod => mod.default), {
//   ssr: false,
// });
// const Editor = dynamic<EditorProps>(
//   () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
//   { ssr: false }
// );


// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "quill/dist/quill.core.css";

import { Delta } from 'quill';


// const RichTextEditor = ({ onChange, value, error, disabled, toolbarOptions }) => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());
//   const [updated, setUpdated] = useState(false);


//   useEffect(() => {
//     const handleValue = async () => {
//       let htmlToDraft = null;
//       if (typeof window === 'object') {
//         htmlToDraft = require('html-to-draftjs').default;
//       }
//       const defaultValue = value ? value : '<p></p>';
//       const blocksFromHtml = await htmlToDraft(defaultValue);
//       const contentState = ContentState.createFromBlockArray(
//         blocksFromHtml.contentBlocks,
//         blocksFromHtml.entityMap
//       );

//       const newEditorState = EditorState.createWithContent(contentState);
//       setEditorState(newEditorState);
//     }
//     if (!updated) handleValue();
//   }, [value]);

//   const onEditorStateChange = (editorState) => {
//     setUpdated(true);
//     setEditorState(editorState);
//     return onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
//   };

//   return (
//     <Editor
//       spellCheck
//       wrapperClassName="rich-text-editor-wrapper"
//       editorClassName="rich-text-editor-editor"
//       editorState={editorState}
//       onEditorStateChange={onEditorStateChange}
//       toolbar={toolbarOptions}
//       stripPastedStyles={true}
//     />
//   );
// };

function resizeImage(image) {
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
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL();
}

const FormRichTextEditor = ({ name, control }) => {
  // const quillRef = useRef();

  // const toolbarOptions = {
  //   options: ['inline', 'blockType', 'list', 'link', 'image', 'remove'],
  //   image: {
  //     uploadEnabled: true,
  //     previewImage: true,
  //     uploadCallback: (file) => {
  //       return new Promise((resolve, reject) => {
  //         console.log('test')
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           let img = new Image();
  //           img.src = reader.result;
  //           img.onload = () => {
  //             resolve({
  //               data: {
  //                 url: resizeImage(img),
  //               },
  //             });
  //           };
  //         };
  //         reader.onerror = (reason) => reject(reason);

  //         reader.readAsDataURL(file);
  //       });
  //     },
  //   }
  // }
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        
        <div
        />
        
        // <Editor
        //   ref={quillRef}
        //   // readOnly={readOnly}
        //   defaultValue={new Delta()
        //     .insert('Hello')
        //     .insert('\n', { header: 1 })
        //     .insert('Some ')
        //     .insert('initial', { bold: true })
        //     .insert(' ')
        //     .insert('content', { underline: true })
        //     .insert('\n')}
        //   // onSelectionChange={setRange}
        //   onTextChange={onChange}
        // />
      )}
    />
  )
};

export default FormRichTextEditor;
