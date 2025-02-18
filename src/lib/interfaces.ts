export type CarCategoryKey = "brakes" |
  "drivetrain" |
  "exhaust" |
  "exterior" |
  "interior" |
  "powertrain" |
  "specification" |
  "suspension"

interface Tire {
  brand: string;
  model: string;
  size: string;
};
interface Wheel {
  brand: string;
  diameter: number;
  model: string;
  offeset: number;
  width: number;
};

export interface BasicCar {
  id: string;
  userId: string;
  username?: string | null;
  modelYear: string;
  make: string;
  model: string;
  submodel?: string;
};

export type WheelTire = {
  isStaggered: boolean;
  tire: {
    front: Tire;
    rear: Tire;
  };
  wheel: {
    front: Wheel;
    rear: Wheel;
  };
}

export type CarProps = {
  [key in CarCategoryKey]: {
    [key: string]: {
      value: string;
    };
  };
};

type FormCarProps = {
  [key in CarCategoryKey]?: {
    [key: string]: {
      value: string;
    };
  };
};

export interface FormCarFields extends FormCarProps {
  modelYear?: string;
  make?: string;
  model?: string;
  submodel?: string;
  description?: string;
  created?: number;
  updated?: number;
  previewImage?: string;
  tags?: string[];
  wheelTire?: WheelTire;
  thumbnails?: {
    [key in CarCategoryKey]: string
  };
};

interface CarProperties extends CarProps {
  description: string;
  created: number;
  updated: number;
  previewImage: string;
  tags: string[];
  wheelTire: WheelTire;
  thumbnails: {
    [key in CarCategoryKey]: string
  }
};
export interface Car extends BasicCar, CarProperties { };