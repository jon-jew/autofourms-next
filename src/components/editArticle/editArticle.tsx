"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from "react-hook-form";

import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import Chip from '@mui/material/Chip';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import { FormRichTextEditor, FormTextField, FormImageCropper } from '@/components/formComponents';
import { createCarArticle, editCarArticle } from '@/lib/firebase/article/articleClient';

import './editArticle.scss';

interface Article {
  content: string,
  title: string,
  userId: string,
  thumbnailImage?: string,
};
interface Car {
  id: string,
  make: string,
  model: string,
  modelYear: string,
};

const EditArticle = (
  {
    data,
    articleId,
    carInfo,
    currentUserId
  }:
    {
      data: Article,
      articleId: string,
      carInfo?: Car | null,
      currentUserId: string,
    }
) => {
  const [imageModal, setImageModal] = useState<boolean>(false);
  useEffect(() => {

  }, []);

  const handleImageModalClose = () => {

  }

  const onSave = async (value: Article) => {
    if (articleId === 'newArticle') {
      await createCarArticle(
        value.content,
        value.title,
        currentUserId,
        carInfo ? carInfo.id : null
      );
    } else {
      await editCarArticle(articleId, value.title, value.content);
    }
  };

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    control,
    watch,
  } = useForm({ defaultValues: data });

  return (
    <>
      <Modal open={imageModal} onClose={handleImageModalClose}>
        <div>
          <FormImageCropper
            onChange={(croppedImg: string) => {
              setValue('thumbnailImage', croppedImg, { shouldDirty: true });
              setImageModal(false);
            }}
            onClose={() => {
              setImageModal(false);
            }}
            aspectRatio={2 / 2}
            imageSize={[400, 400]}
            initialImgSrc={watch('thumbnailImage')}
            headerText='Thumbnail Image'
          />
        </div>
      </Modal>
      <form className="article-form" onSubmit={handleSubmit(onSave)}>
        <div className="inline-flex">
          <h2 className="page-title">
            {articleId === 'newArticle' ? 'New Article' : 'Edit Article'}
          </h2>
        </div>
        <div>
          <FormTextField
            name="title"
            control={control}
            width={300}
            label="Title"
          />
          {carInfo &&
            <Chip
              sx={{ marginLeft: 1 }}
              label={`${carInfo.modelYear} ${carInfo.make} ${carInfo.model}`}
              avatar={<DirectionsCarIcon />}
            />
          }
        </div>
        <div>
          <FormRichTextEditor name="content" control={control} />
        </div>
        <div className="footer">
          <Button
            type="submit"
            variant="contained"
            size="small"
          >
            Save
          </Button>
          <Link href={
            articleId === "newArticle" ? "/" : `/article/${articleId}`
          }>
            <Button size="small">
              Cancel
            </Button>
          </Link>
        </div>
      </form >
    </>
  )
};

export default EditArticle;
