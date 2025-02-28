import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Overpass } from "next/font/google";
import { Quantico } from "next/font/google";

import CarCard from './carCard';


const overpass = Overpass({
  subsets: ['latin'],
  variable: "--font-overpass",
});

const quantico = Quantico({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: "--font-quantico",
});
const meta = {
  title: 'Car Card',
  component: CarCard,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },

  decorators: [
    (Story) => (
      <main className={`${quantico.variable} ${overpass.variable}`}>
        <Story />
      </main>
    ),
  ],
  // args: {
  //   data
  // },
} satisfies Meta<typeof CarCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TestCard: Story = {
  args: {
    data: {
      make: "Toyota",
      model: "MR2 Spyder",
      modelYear: "2004",
      previewImage: "https://firebasestorage.googleapis.com/v0/b/autofourms.firebasestorage.app/o/34520492-d014-4dae-b3ca-24638f2a7f19%2FpreviewImage?alt=media&token=127f3d1f-2fa1-4ce3-8333-8ec2c81644e5",
      submodel: "ZZW30",
      username: "testuser",
      tags: ["2zz Swap", "Roadster", "Froge"],
    },
  },
};

