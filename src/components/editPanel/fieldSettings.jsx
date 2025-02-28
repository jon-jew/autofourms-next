import Image from 'next/image';

const FIELD_ARRAYS = [
  {
    title: 'Specification',
    name: 'specification',
    isAutoComplete: false,
    hasDetailModal: false,
    icon: <Image src="/specification-icon-red.png" width={24} height={24} alt="Powertrain Icon" />,
    options: [
      {
        label: 'Power',
        type: 'text'
      },
      {
        label: 'Torque',
        type: 'text'
      },
      {
        label: 'Layout',
        type: 'select',
        options: ['FF', 'FR', 'MR', 'AWD', 'RR', 'M4WD']
      },
      {
        label: 'Engine',
        type: 'text'
      },
      {
        label: 'Transmission',
        type: 'text'
      },
      {
        label: 'Weight',
        type: 'text'
      },
      {
        label: 'Color',
        type: 'text',
      },
      {
        label: '0-60',
        type: 'text',
      },
    ],
  },
  {
    title: 'Powertrain',
    name: 'powertrain',
    isAutoComplete: true,
    hasDetailModal: false,
    icon: <Image src="/engine-icon-red.png" width={20} height={20} alt="Powertrain Icon" />,
    options: [
      {
        label: 'Engine',
        type: 'text',
      },
      {
        label: 'Air Filter',
        type: 'text',
      },
      {
        label: 'Turbocharger',
        type: 'text',
      },
      {
        label: 'Supercharger',
        type: 'text',
      },
      {
        label: 'Intake Manifold',
        type: 'text',
      },
      {
        label: 'Camshafts',
        type: 'text',
      },
      {
        label: 'Valve Springs',
        type: 'text',
      },
      {
        label: 'Fuel Injectors',
        type: 'text',
      },
      {
        label: 'Fuel Pump',
        type: 'text',
      },
      {
        label: 'ECU',
        type: 'text',
      },
      {
        label: 'Pistons',
        type: 'text',
      },
      {
        label: 'Rods',
        type: 'text',
      },
      {
        label: 'Head Studs',
        type: 'text',
      },
      {
        label: 'Harmonic Damper',
        type: 'text',
      },
    ]
  },
  {
    title: 'Drivetrain',
    name: 'drivetrain',
    isAutoComplete: true,
    hasDetailModal: false,
    icon: <Image src="/drivetrain-icon-red.png" alt="Drivetrain Icon" width={20} height={20} />,
    options: [
      {
        label: 'Transmission',
        type: 'text',
      },
      {
        label: 'Clutch',
        type: 'text',
      },
      {
        label: 'Flywheel',
        type: 'text',
      },
      {
        label: 'Driveshaft',
        type: 'text',
      },
      {
        label: 'Differential',
        type: 'text',
      },
      {
        label: 'Final Drive',
        type: 'text',
      },
    ]
  },
  {
    title: 'Exhaust',
    name: 'exhaust',
    isAutoComplete: true,
    hasDetailModal: false,
    icon: <Image src="/exhaust-icon-red.png" alt="Exhuast Icon" width={24} height={24} />,
    options: [
      {
        label: 'Exhaust Manifold',
        type: 'text',
      },
      {
        label: 'Downpipe',
        type: 'text',
      },
      {
        label: 'Catback',
        type: 'text',
      },
      {
        label: 'Cat',
        type: 'text',
      },
    ]
  },
  {
    title: 'Suspension',
    name: 'suspension',
    isAutoComplete: true,
    hasDetailModal: false,
    icon: <Image src="/suspension-icon-red.png" alt="suspension icon" width={20} height={20} />,
    options: [
      {
        label: 'Coilovers',
        type: 'text',
      },
      {
        label: 'Springs',
        type: 'text',
      },
      {
        label: 'Shocks',
        type: 'text',
      },
      {
        label: 'Front Lower Control Arm',
        type: 'text',
      },
      {
        label: 'Tie Rods',
        type: 'text',
      },
    ]
  },
  {
    title: 'Brakes',
    name: 'brakes',
    isAutoComplete: true,
    hasDetailModal: false,
    icon: <Image src="/brakes-icon-red.png" alt="Brake Icon" width={20} height={20} />,
    options: [
      {
        label: 'Pads',
        type: 'text'
      },
      {
        label: 'Rotors',
        type: 'text'
      },
      {
        label: 'Calipers',
        type: 'text'
      },
      {
        label: 'Brake Lines',
        type: 'text'
      },
      {
        label: 'Brake Fluid',
        type: 'text'
      },
      {
        label: 'Master Cylinder',
        type: 'text'
      },
    ],
  },
  {
    title: 'Exterior',
    name: 'exterior',
    isAutoComplete: true,
    hasDetailModal: false,
    icon: <Image src="/exterior-icon-red.png" alt="Exterior Icon" width={24} height={24} />,
    options: [
      {
        label: 'Front Bumper',
        type: 'text',
      },
      {
        label: 'Rear Bumper',
        type: 'text',
      },
      {
        label: 'Spoiler',
        type: 'text',
      },
      {
        label: 'Rear Wing',
        type: 'text',
      },
      {
        label: 'Widebody Kit',
        type: 'text',
      },
      {
        label: 'Side Skirts',
        type: 'text',
      },
      {
        label: 'Front Lip',
        type: 'text',
      },
      {
        label: 'Rear Lip',
        type: 'text',
      },
      {
        label: 'Hood',
        type: 'text',
      },
      {
        label: 'Trunk',
        type: 'text',
      },
    ]
  },
  {
    title: 'Interior',
    name: 'interior',
    isAutoComplete: true,
    hasDetailModal: false,
    icon: <Image src="/interior-icon-red.png" alt="interior icon" width={20} height={20} />,
    options: [
      {
        label: 'Seats',
        type: 'text'
      },
      {
        label: 'Steering Wheel',
        type: 'text'
      },
      {
        label: 'Roll Cage',
        type: 'text'
      },
      {
        label: 'Harness',
        type: 'text'
      },
      {
        label: 'Shift Knob',
        type: 'text'
      },
      {
        label: 'Gauges',
        type: 'text'
      },
    ],
  },
];

const getCategoryKeys = () => {
  return FIELD_ARRAYS.map((fieldArray) => fieldArray.name);
};

const getCategories = () => {
  return FIELD_ARRAYS.map((fieldArray) => {
    return {
      name: fieldArray.name,
      title: fieldArray.title,
      icon: fieldArray.icon,
    }
  });
}

const getIcon = (name) => {
  const found = FIELD_ARRAYS.find((category) => category.name === name);
  return found ? found.icon : null;
};

export {
  getCategories,
  getCategoryKeys,
  FIELD_ARRAYS,
  getIcon,
};
