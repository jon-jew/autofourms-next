"use client";

import React, { useEffect, useState, useContext } from "react";
import { redirect } from "next/navigation"

import EditPanel from "@/components/editPanel";
import LoadingOverlay from "@/components/loadingOverlay";
import { UserContext } from "@/contexts/userContext";
import { LoadingContext } from "@/contexts/loadingOverlayContext";

import { getCar, editCar } from "@/lib/firebase/car";

const EditPage = ({
  params,
}: {
  params: Promise<{ carId: string }>
}) => {
  const { user, userLoading } = useContext(UserContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [data, setData] = useState<any | null>(null);
  const [carId, setCarId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarData = async () => {
      const param = (await params).carId;
      if (!param) redirect("/");
      const carData = await getCar(param);
      if (carData.userId !== user.uid) redirect("/");

      setCarId(param);
      setData(carData);
      setIsLoading(false);
    }
    if (!user && !userLoading) redirect("/");
    setIsLoading(true);
    if (!userLoading) fetchCarData();
  }, [userLoading]);

  const onSave = async (
    changes: { [key: string]: any},
    dirtyImages: { name: string, value: string }[],
    cb: Function,
  ) => {
    setIsLoading(true);
    if (carId) {
      const res = await editCar(carId, changes, dirtyImages);
      if (res) redirect(`/car-profile/${carId}?tab=2`);
      else  {
        setIsLoading(false);
        cb();
      }
    }
  }

  return (
    <div>
      <LoadingOverlay isLoading={isLoading} />
      {data && carId !== null &&
        <EditPanel data={data} onSave={onSave} carId={carId} />
      }
    </div>
  )
};

export default EditPage;
