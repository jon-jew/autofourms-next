"use client";

import React, { useState, useContext, useEffect } from 'react';
import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import { FormImageCropper } from '@/components/formComponents';
import { createCarImage, getCarImages, deleteCarImage, editCarCaption } from '@/lib/firebase/carImage';

import './imageGallery.scss';

interface ImageEntry {
  id: string;
  caption?: string;
  carId: string;
  created: number;
  image: string;
  userId: string;
};

interface SelectedImageProps {
  image: ImageEntry | null;
  handleImageChange: any;
  currentUserId?: string;
  ownerId: string;
  onClose: Function;
  idx: number | null;
  getImages: Function;
};

const SelectedImage = ({
  image,
  handleImageChange,
  currentUserId,
  ownerId,
  onClose,
  idx,
  getImages
}: SelectedImageProps) => {
  if (image === null || idx === null) return null;

  const [editActive, setEditActive] = useState<boolean>(false);
  const [deleteActive, setDeleteActive] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [editedCaption, setEditedCaption] = useState<string>(image.caption ? image.caption : '');
  const open = Boolean(anchorEl);

  const handleClick = (event:
    React.MouseEvent<HTMLAnchorElement, MouseEvent> |
    React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    setEditActive(true);
    setAnchorEl(null);
  };
  const handleDelete = () => {
    setDeleteActive(true);
    setAnchorEl(null);
  };

  const handleConfirmEdit = async () => {
    if (currentUserId === ownerId) {
      const res = await editCarCaption(image.id, editedCaption);
      if (res) {
        setEditActive(false)
        getImages();
      }
    }
  };
  const handleConfirmDelete = async () => {
    if (currentUserId === ownerId) {
      const res = await deleteCarImage(image.id, currentUserId);
      if (res) {
        onClose();
        getImages();
      } else {
        setDeleteActive(false);
      }
    }
  };

  return (
    <div className="selected-image-container">
      <IconButton
        style={{ position: 'absolute', top: '50%', left: '-10px' }}
        onClick={() => handleImageChange(-1)}
      >
        <NavigateBeforeIcon />
      </IconButton>
      <IconButton
        style={{ position: 'absolute', top: '50%', right: '-10px' }}
        onClick={() => handleImageChange(1)}
      >
        <NavigateNextIcon />
      </IconButton>
      {(deleteActive || editActive) && currentUserId === ownerId &&
        <div className="image-msg-container">
          {deleteActive &&
            <div className="image-msg">
              <p>Are you sure you want to delete?</p>
              <Stack spacing={1}>
                <Button onClick={handleConfirmDelete} size="small" color="error" variant="contained">
                  Delete
                </Button>
                <Button onClick={() => setDeleteActive(false)} size="small" variant="text">
                  Cancel
                </Button>

              </Stack>
            </div>
          }
          {editActive &&
            <div className="image-msg">
              <TextField
                size="small"
                label="Edit Caption"
                fullWidth
                style={{ marginBottom: 10 }}
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                multiline
                rows={4}
              />
              <Stack direction="row" spacing={1}>
                <Button onClick={handleConfirmEdit} size="small" variant="contained">
                  Save
                </Button>
                <Button onClick={() => setEditActive(false)} size="small" variant="text">
                  Cancel
                </Button>

              </Stack>
            </div>
          }
        </div>
      }
      <div className="image-button-container">
        {currentUserId === ownerId &&
          <>
            <IconButton
              disabled={deleteActive}
              onClick={handleClick}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem sx={{ color: 'red' }} onClick={handleDelete}>Delete</MenuItem>
            </Menu>
            <IconButton disabled={deleteActive} onClick={(event) => onClose()}>
              <CloseIcon />
            </IconButton>
          </>
        }
      </div>
      <div className="modal-image">
        <Image alt="Image Gallery" src={image.image} fill />
      </div>
      <p className="modal-image-footer">{image.caption}</p>
    </div>
  );
};

interface ThumbnailProps {
  item: {
    id: string;
    image: string;
  };
  handleClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

const ImageThumbnail = ({ item, handleClick }: ThumbnailProps) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <a
      key={item.id}
      onClick={handleClick}
      className="image-preview loading"
    >
      <Image
        src={item.image}
        alt="gallery image"
        fill
        style={{
          objectFit: 'contain',
          opacity: loaded ? 1 : 0
        }}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </a>
  )
};

export default function ImageGallery(
  { carId, ownerId, currentUserId }:
    { carId: string, ownerId: string, currentUserId?: string }
) {
  const [newImageModal, setNewImageModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>(-1);
  const [selectedImageModal, setSelectedImageModal] = useState<boolean>(false);
  const [images, setImages] = useState<ImageEntry[]>([]);

  const getImages = async () => {
    const imageList = await getCarImages(carId);
    if (imageList) setImages(imageList);
  };

  useEffect(() => { getImages(); }, [newImageModal]);

  const handleNewImageClose = () => setNewImageModal(false);
  const handleSelectedImageClose = () => {
    setSelectedImageModal(false);
    setSelectedImage(-1);
  };
  const handleSelectedImageOpen = (idx: number) => {
    setSelectedImageModal(true);
    setSelectedImage(idx);
  };

  const handleImageChange = (change: number) => {
    if (selectedImage !== -1) {
      if (selectedImage + change > images.length - 1) {
        setSelectedImage(0);
      } else if (selectedImage + change < 0) {
        setSelectedImage(images.length - 1);
      } else {
        setSelectedImage(selectedImage + change);
      }
    }
  };

  const onImageUpload = async (image: string, caption?: string | null) => {
    if (currentUserId === ownerId) {
      const res = await createCarImage(carId, currentUserId, image, caption);
      if (res) handleNewImageClose();
    }
  };

  return (
    <div>
      <Modal
        open={selectedImageModal}
        onClose={handleSelectedImageClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SelectedImage
          handleImageChange={handleImageChange}
          ownerId={ownerId}
          onClose={() => {
            setSelectedImageModal(false);
            setSelectedImage(-1);
          }}
          image={selectedImage !== -1 ? images[selectedImage] : null}
          idx={selectedImage}
          getImages={getImages}
        />
      </Modal>
      <Modal
        open={newImageModal}
        onClose={handleNewImageClose}
        disableEscapeKeyDown={false}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <FormImageCropper
          initialImgSrc={null}
          aspectRatio={1 / 1}
          imageSize={[800, 800]}
          onChange={onImageUpload}
          onClose={() => setNewImageModal(false)}
          headerText="New Gallery Image"
          hasCaption
        />
      </Modal>

      <div className="image-gallery">
        {ownerId === currentUserId &&
          <div className="top-button-container">
            <Button
              size="small"
              variant="contained"
              sx={{ backgroundColor: '#b81111', textTransform: 'capitalize' }}
              startIcon={<AddPhotoAlternateIcon />}
              onClick={() => setNewImageModal(true)}
            >
              New Images
            </Button>
          </div>
        }
        {images.map((item, idx) => (
          <ImageThumbnail
            key={item.id}
            item={item}
            handleClick={(event) => handleSelectedImageOpen(idx)}
          />
        ))}
      </div>
    </div>
  );
};
