import { toastSuccess, toastError } from "../components/utils";

const HOST = 'http://localhost:3001';

const getCar = async (carId, onSuccess) => {
  try {
    const res = await fetch(`${HOST}/get-car/${carId}`, { method: 'GET' });
    if (res.status === 200) {
      const data = await res.json();
      onSuccess(data);
    } else {
      toastError('Filed to fetch car info');
    }
  } catch(e) {
    console.log(e);
    toastError('Failed to fetch car info');
  }
};

const getCarImages = async (carId, onSuccess) => {
  try {
    const res = await fetch(`${HOST}/get-car-images/${carId}`, { method: 'GET' });
    if (res.status === 200) {
      const data = await res.json();
      onSuccess(data);
    } else {
      toastError('Failed to fetch images');
    }
  } catch (e) {
    console.log(e)
    toastError('Failed to fetch images')
  }
};

const uploadCarImage = async (
  image,
  caption,
  data,
  userId,
  onSuccess,
  onFail,
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    "id": data.id,
    "image": image,
    "caption": caption,
    "user": userId,
    "carInfo": {
      make: data.make,
      model: data.model,
      modelYear: data.modelYear
    }
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const res = await fetch(`${HOST}/create-car-image`, requestOptions);
    if (res.status === 200) {
      toastSuccess('Uploaded new image');
      onSuccess();
    } else {
      toastError('Failed to upload image');
    }

  } catch (error) {
    toastError('Failed to upload image');
    onFail();
  }
}

const editCarImage = async (imageId, editedCaption, onSuccess, onFail) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      headers: myHeaders,
      method: 'POST',
      body: JSON.stringify({ changes: { caption: editedCaption } })
    };
    const res = await fetch(`${HOST}/update-car-image/${imageId}`, requestOptions);
    console.log(res)
    if (res.status === 200) {
      toastSuccess('Saved edits for image');
      onSuccess();
    } else {
      toastError('Failed to save edit')
    }

  } catch (e) {
    toastError('Failed to save edits');
    onFail();
  }
}

const deleteCarImage = async (imageId, onSuccess, onFail) => {
  try {
    const res = await fetch(`${HOST}/delete-car-image/${imageId}`, { method: 'DELETE' });
    if (res.status === 200) {
      toastSuccess('Deleted image');
      onSuccess();
    } else {
      onFail();
    }
  } catch (error) {
    toastError('Failed to delete image');
    onFail();
  }
};

const createNewArticle = async (article, user, onSuccess, onFail) => {
  const myHeaders = new Headers({
    'Authorization': user.accessToken,
    'Content-Type': 'application/json'
  });
  // myHeaders.append("Content-Type", "application/json");
  const requestOptions = {
    headers: myHeaders,
    method: 'POST',
    body: JSON.stringify({ article: article })
  };
  
  try {
  const res = await fetch(`${HOST}/create-article`, requestOptions);
  } catch (e) {
    toastError('Failed to save article')
  }

}

export default {
  getCar,
  getCarImages,
  uploadCarImage,
  editCarImage,
  deleteCarImage,
  createNewArticle,
}
