export type Screen = 'LANDING' | 'LOGIN' | 'PROFILE' | 'GOALS' | 'GARAGE' | 'PERFORMANCE' | 'TELEMETRY' | 'STAGING' | 'PRICING' | 'RELIABILITY' | 'WORKFLOW' | 'AERO' | 'DRIVETRAIN' | 'CHASSIS' | 'ELECTRONICS' | 'PARTS_PRICING' | 'CATALOGUE' | 'WATCHLIST' | 'INTELLIGENCE' | 'INTEL_FEED' | 'BUILD_LOG' | 'MARKETPLACE';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  garageCount: number;
  totalBuildValue: number;
  joinedAt: string;
}

export type ActivityType = 'TIME_ATTACK' | 'DRAG_RACING' | 'CIRCUIT_RACING' | 'DRIFT' | 'STREET';

export interface BuildGoals {
  targetHp: number;
  targetWeight: number;
  activity: ActivityType;
  budget: number;
}

export interface WatchlistItem {
  id: string;
  partId: string;
  name: string;
  brand: string;
  currentPrice: number;
  marketPrices: {
    source: string;
    price: number;
    url: string;
  }[];
  addedAt: string;
}

export interface Car {
  id: string;
  name: string;
  platform: string;
  version: string;
  image: string;
  price: number;
  locked: boolean;
  active?: boolean;
  specs: {
    hp: number;
    weight: number;
    engine: string;
    displacement: number;
    wheelbase: number;
    mileage: number;
    transmission: 'MANUAL' | 'AUTOMATIC' | 'DCT';
    drivetrain: 'RWD' | 'AWD' | 'FWD';
    exteriorColor: string;
    interiorColor: string;
    owners: number;
    accidents: number;
    year: number;
    bodyStyle: 'COUPE' | 'SEDAN' | 'HATCHBACK' | 'CONVERTIBLE';
    fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  };
  performance: {
    powerIndex: number;
    gripCoefficient: number;
    downforceBalance: number;
  };
}

export interface Part {
  id: string;
  name: string;
  brand: string;
  description: string;
  image: string;
  price: number;
  confidence: number;
  stats: {
    label: string;
    value: string;
    color: 'primary' | 'secondary' | 'outline';
  }[];
  tags?: ActivityType[];
  equipped?: boolean;
}

export interface LogEntry {
  timestamp: string;
  source: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
}
