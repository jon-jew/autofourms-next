'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from "react-hook-form";

import ButtonBase from '@mui/material/ButtonBase';
import Button from "@mui/material/Button";
import Avatar from '@mui/material/Avatar';

import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

import { editUserProfile } from '@/lib/firebase/user/userClient';

import { FormTextField } from "../formComponents";
import { toastSuccess, toastError } from '../utils';

import './editUser.scss';

const avatarSx = {
  width: 64,
  height: 64,
};

interface FormFields {
  username: string,
  profileImage: string,
};

const EditUser = ({ currentUserId, username, profileImage }:
  { currentUserId: string, username: string, profileImage?: string }
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: {
      dirtyFields
    }
  } = useForm({
    defaultValues: {
      username: username,
      profileImage: profileImage ? profileImage : '',
    }
  });

  const handleSave = async (formValues: FormFields) => {
    setLoading(true);
    const changes: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(dirtyFields)) {
      if (value && (key === 'username' || key === 'profileImage')) {
        changes[key] = formValues[key];
      }
    }
    const res = await editUserProfile({
      userUid: currentUserId,
      changes,
    });
    if (res) toastSuccess('Saved profile');
    else toastError('Failed to save profile');
    setLoading(false);
  };

  const handleError = () => {

  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setValue('profileImage', reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (

    <div className="flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit(handleSave, handleError)}
        className="flex flex-col bg-white px-5 pt-4 pb-3 gap-2 shadow-lg rounded-md min-w-[275px]"
      >
        <div className="inline-flex">
          <h2 className="page-title mb-2">
            <PersonIcon /> Edit Profile
          </h2>
        </div>
        <div className="mb-2">

          <ButtonBase
            component="label"
            role={undefined}
            tabIndex={-1} // prevent label from tab focus
            aria-label="Avatar image"
            sx={{
              justifyContent: 'flex-start',

              borderRadius: '40px',
              '&:has(:focus-visible)': {
                outline: '2px solid',
                outlineOffset: '2px',
              },
            }}
          >
            <Avatar
              sx={avatarSx}
              alt="Upload new avatar"
              src={watch('profileImage')}
            />
            <input
              type="file"
              accept="image/*"
              style={{
                border: 0,
                clip: 'rect(0 0 0 0)',
                height: '1px',
                margin: '-1px',
                overflow: 'hidden',
                padding: 0,
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
              }}
              onChange={handleAvatarChange}
            />
            <div className="profile-image-overlay">
              <EditIcon />
            </div>
          </ButtonBase>
        </div>

        <FormTextField
          control={control}
          name="username"
          label="Display Name"
          width={120}
        />
        <div className="flex flex-row justify-end w-full mt-3">
          <Button loading={loading} variant="contained" type="submit">
            Save
          </Button>
          <Link href={`/user-profile/${currentUserId}`}>
            <Button>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
};

export default EditUser;
