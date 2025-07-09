'use server';
import { redirect } from 'next/navigation';

import EditPanel from "@/components/editPanel";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

const initialData = {
  modelYear: "",
  make: "",
  model: "",
  submodel: "",
  description: "",
  tags: [],
  thumbnails: {},
  wheelTire: {
    isStaggered: false,
    tire: {
      front: {
        brand: "",
        model: "",
        size: "",
      },
      rear: {
        brand: "",
        model: "",
        size: "",
      },
    },
    wheel: {
      front: {
        brand: "",
        diameter: null,
        model: "",
        offset: null,
        width: null,
      },
      rear: {
        brand: "",
        diameter: null,
        model: "",
        offset: null,
        width: null,
      }
    }
  }
};

export default async function NewCarPage () {
  const { currentUser } = await getAuthenticatedAppForUser();
  const currentUserId = currentUser?.uid;
  if (!currentUserId) redirect('/');

  return (
    <EditPanel
      carId="newCar"
      currentUserId={currentUserId}
      data={initialData}
      isNewProfile
    />
  )
};
