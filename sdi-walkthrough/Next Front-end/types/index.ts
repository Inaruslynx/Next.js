export interface GraphData {
  labels: Date[];
  datasets: [
    {
      data: number[];
    },
  ];
}

export interface DataPoint {
  index?: number;
  _id?: string;
  text: string;
  type: "number" | "string" | "boolean";
  value?: number | string | boolean;
  unit?: string;
  min?: number;
  max?: number;
  choices?: string[];
  parentArea: string;
  parentWalkthrough: string;
  isNew?: boolean;
}

export interface Area {
  index?: number;
  _id?: string;
  name: string;
  parentType: "area" | "walkthrough";
  parentWalkthrough: string;
  parentArea?: string;
  areas: Area[];
  dataPoints: DataPoint[];
  isNew?: boolean;
}

export interface WalkthroughData {
  id: string;
  name: string;
}

export interface Walkthroughs {
  walkthroughs: WalkthroughData[];
}

export interface Walkthrough {
  _id?: string;
  name: string;
  periodicity?: PeriodicityOptions;
  weekly?: WeeklyOptions;
  perSwing?: PerSwingOptions;
  department: string | Department;
  data: Array<Area>;
}

export interface createWalkthroughResponse {
  name: string;
}

export interface Department {
  _id?: string;
  name: string;
  walkthroughs: Walkthrough[];
}

export interface Log {
  _id?: string;
  walkthrough: string;
  data: {
    dataPoint: string;
    value: string | number | boolean;
  }[];
}

export interface User {
  _id?: string;
  email: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
  assignedWalkthroughs: Walkthrough[] | string[];
  department: Department | string;
  admin?: boolean;
  type?: Theme;
}

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
  CUPCAKE = "cupcake",
  BUMBLEBEE = "bumblebee",
  EMERALD = "emerald",
  CORPORATE = "corporate",
  SYNTHWAVE = "synthwave",
  RETRO = "retro",
  CYBERPUNK = "cyberpunk",
  VALENTINE = "valentine",
  HALLOWEEN = "halloween",
  GARDEN = "garden",
  FOREST = "forest",
  AQUA = "aqua",
  LOFI = "lofi",
  PASTEL = "pastel",
  FANTASY = "fantasy",
  WIREFRAME = "wireframe",
  BLACK = "black",
  LUXURY = "luxury",
  DRACULA = "dracula",
  CMYK = "cmyk",
  AUTUMN = "autumn",
  BUSINESS = "business",
  ACID = "acid",
  LEMONADE = "lemonade",
  NIGHT = "night",
  COFFEE = "coffee",
  WINTER = "winter",
  DIM = "dim",
  NORD = "nord",
  SUNSET = "sunset",
}

export enum PeriodicityOptions {
  PerShift = "Per Shift",
  Daily = "Daily",
  PerSwing = "Per Swing",
  Weekly = "Weekly",
  BiWeekly = "Bi-Weekly",
  Monthly = "Monthly",
}

export enum WeeklyOptions {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export type WeeklyOptionsType = WeeklyOptions | undefined;

export enum PerSwingOptions {
  First = "First Day",
  Second = "Second Day",
  Third = "Third Day",
  Fourth = "Fourth Day",
}

export type PerSwingOptionsType = PerSwingOptions | undefined;
