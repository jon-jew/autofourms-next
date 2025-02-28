"use client";

import React, { useEffect, useContext, useState } from "react";
import { redirect } from 'next/navigation';

import EditPanel from "@/components/editPanel";
import { createCar } from "@/lib/firebase/car";
import { UserContext } from "@/contexts/userContext";

const initialData = {
  modelYear: "",
  make: "",
  model: "",
  submodel: "",
  description: "",
  tags: [],
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

const NewCarPage = () => {
  const { user, userLoading } = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user && !userLoading) redirect('/');
    else if (!userLoading) setLoading(false);
  }, [userLoading]);

  const onSave = async (
    changes: { [key: string]: any },
    dirtyImages: { name: string, value: string }[],
    cb: Function
  ) => {
    const res = await createCar(changes, dirtyImages, user.uid);
    if (res) redirect(`/car-profile/${res}`);
    else {
      setLoading(false);
      cb();
    }
  };

  return (
    <EditPanel
      data={initialData}
      onSave={onSave}
      isNewProfile
    />
  )
};

export default NewCarPage;
