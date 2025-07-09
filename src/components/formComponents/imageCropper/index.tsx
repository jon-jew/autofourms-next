import React, { useState } from 'react'
import Cropper from 'react-easy-crop'

import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import { getOrientation } from 'get-orientation/browser'
import { getCroppedImg, getRotatedImage } from './canvasUtils'
import './imageCropper.scss'

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ImageCropperProps {
  initialImgSrc: string | undefined | null;
  onChange: (image: string, caption?: string | null) => void;
  onClose: any;
  HeaderIcon?: any;
  headerText?: string;
  hasCaption?: boolean;
  aspectRatio: number;
  imageSize: number[];
};

const ImageCropper = ({
  initialImgSrc,
  onChange,
  onClose,
  HeaderIcon,
  headerText,
  hasCaption,
  aspectRatio,
  imageSize,
}: ImageCropperProps) => {
  const [imageSrc, setImageSrc] = React.useState<null | string | undefined>(initialImgSrc);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [caption, setCaption] = useState<string | null>(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        imageSize,
      );
      console.log('donee', { croppedImage });
      //@ts-ignore
      onChange(croppedImage, caption);
    } catch (e) {
      console.error(e);
    }
  }

  const onFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file) as string;

      try {
        // apply rotation if needed
        const orientation = await getOrientation(file) as unknown as string as '3' | '6' | '8';
        const rotation = ORIENTATION_TO_ANGLE[orientation];
        if (rotation) {
          //@ts-ignore
          imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
        }
      } catch (e) {
        console.warn('failed to detect the orientation');
      }

      setImageSrc(imageDataUrl);
    }
  }

  return (
    <div className="modal-container">
      <div className="modal-header">
        <div className="modal-header-title">
          {/* <Chip avatar={icon} sx={{ fontWeight: 'bold' }} label={label} /> */}
          {headerText}
        </div>
        <div className="close-container">
          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {imageSrc ?
        <React.Fragment>
          <div className="cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              zoomSpeed={0.2}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="controls-container">
            <div>
              <Typography
                variant="overline"
              >
                Zoom
              </Typography>
              <Slider
                value={zoom}
                size="small"
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                //@ts-ignore
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
            <div>
              <Typography
                variant="overline"
              >
                Rotation
              </Typography>
              <Slider
                value={rotation}
                min={0}
                size="small"
                max={360}
                step={1}
                aria-labelledby="Rotation"
                //@ts-ignore
                onChange={(e, rotation) => setRotation(rotation)}
              />
            </div>
            {hasCaption &&
              <TextField
                id="outlined-multiline-flexible"
                label="Caption"
                onChange={(event) => {
                  setCaption(event.target.value);
                }}
                value={caption}
                multiline
                maxRows={4}
              />
            }
          </div>

        </React.Fragment> :
        <div className="cropper-image-placeholder">
          <ImageNotSupportedIcon sx={{ opacity: 0.5 }} />
        </div>
      }
      <div className="buttons-container">
        <Button
          component="label"
          role={undefined}
          size="small"
          color="success"
          variant="contained"
          tabIndex={-1}
          sx={{ textTransform: 'capitalize ' }}
          startIcon={<CloudUploadIcon />}
        >
          Upload Image
          <VisuallyHiddenInput
            type="file"
            onChange={onFileChange}
            accept="image/*"
          />
        </Button>
        <Button
          disabled={!imageSrc}
          onClick={showCroppedImage}
          variant="contained"
          sx={{ textTransform: 'capitalize ' }}
          color="primary"
          size="small"
        >
          Set Image
        </Button>
      </div>
    </div>
  )
}

function readFile(file: any) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

export default ImageCropper;
