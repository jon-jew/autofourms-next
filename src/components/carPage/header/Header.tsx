"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import GarageIcon from '@mui/icons-material/Garage';

import { handleLike } from '@/lib/firebase/car/carClient';
import { formatLikeCount } from '../../utils';
import CarCard from '@/components/carCard/carCard';

import './header.scss'

export default function Header(
  { data,
    isUserOwner,
    currentUserId,
  }:
    {
      data: { [key: string]: any },
      isUserOwner: boolean,
      currentUserId: string | undefined,
    }
) {
  const [bookmark, setBookmark] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(data.userLikes);
  const [liked, setLiked] = React.useState(data.isLikedByUser);

  const handleBookmarkClick = () => {
    setBookmark(!bookmark);
  };

  const handleLikeClick = () => {
    if (currentUserId) {
      handleLike(data.id, currentUserId);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    }
  };

  return (
    <div className="car-page-header">
      <div className="header-container">
        <CarCard data={data} disableFooter disableHover disableLink />
        <div className="button-container">
          <IconButton
            disabled={!currentUserId}
            title="Like"
            onClick={handleLikeClick}
          >
            <Badge
              badgeContent={
                !isNaN(data.userLikes) ?
                  formatLikeCount(likeCount) :
                  '0'
              }
              color={liked ? 'error' : 'default'}
              sx={{
                '& .MuiBadge-badge': {
                  left: 35,
                  top: -7,
                  padding: '10px 4px',
                  fontSize: '12px'
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </Badge>
          </IconButton>
          <IconButton sx={{ marginLeft: '10px' }} title="Bookmark" onClick={handleBookmarkClick} size="small">
            {bookmark ? <BookmarkIcon color="warning" /> : <BookmarkBorderIcon />}
          </IconButton>
          <Link href={`/user-profile/${data.userId}`}>
            <IconButton size="small">
              <GarageIcon />
            </IconButton>
          </Link>
          {isUserOwner &&
            <Link href={`/edit-car/${data.id}`}>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
            </Link>
          }
        </div>
        <div className="header-tags-container">
          {Array.isArray(data.tags) && data.tags.map(
            (tag) => <Chip key={tag} label={tag} size="small" />
          )}
        </div>
        {data.description &&
          <div className="description-container">
            {data.description}
          </div>
        }
      </div>
    </div>
  );
};
