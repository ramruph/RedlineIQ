import { Car, Part, LogEntry } from './types';

export const CARS: Car[] = [
  {
    id: 'A90 SUPRA',
    name: 'A90 SUPRA',
    platform: 'JZA90',
    version: '4.2.1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxS-zr-4yWuhT9wYXORP_JgmVgCosAmnmpTLkVwuBCghCp6zF4z6vfZOsz7mfng2vSyArPwV8CNCCvMC-huVdslq2MKKb5UK60MP68fhHZ5WMlOxCMtIgfPXsiQvWjS7bmsIePAWEJZvdvTz3mSX3ibD7IVKFd8dT1Hbsr7CMVG9QPk5fB6au-C0lSCpceLi1sI3VqXxaEAJWNmYhU54JDrVlSAKIO2WMQvcGXoE7eVfGmFmw2erLF_zbpDoW5LerbxWsO0TSeEX4',
    price: 45000,
    locked: false,
    active: true,
    specs: {
      hp: 326,
      weight: 1510,
      engine: 'B58',
      displacement: 3.0,
      wheelbase: 2550,
      mileage: 42000,
      transmission: 'MANUAL',
      drivetrain: 'RWD',
      exteriorColor: 'TURBULENCE GRAY',
      interiorColor: 'BLACK_LEATHER',
      owners: 2,
      accidents: 0,
      year: 2022,
      bodyStyle: 'COUPE',
      fuelType: 'GASOLINE'
    },
    performance: {
      powerIndex: 78,
      gripCoefficient: 62,
      downforceBalance: 45
    }
  },
  {
    id: 'R34_GTR',
    name: 'R34 GTR',
    platform: 'BNR34',
    version: '2.8.0',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJv1I9oqXqmnOnOkCPWW4lLN298Z_G5LrqvkRvIzEpi6BsJ8hII3ARt651ujTDa3W9-lb9DelybgHuiGaUinbk3rlpHu_ZeoZYbqFaoha7caOMUSFjYnuw3cridBCY6PVhWf12oyLFar8jthRAFNp7eH4wvGXQwNHkmOIHoo2AmIFetuI9DYR1BUVugxxizUzLLsM6JDQO8AZXmm5RTDxxw9t_bxqpBcCidkkQwvzU8oUZy9daOTs-PS6Ix5e7GO9GuXlK2Nk33G0',
    price: 120000,
    locked: true,
    specs: { 
      hp: 276, 
      weight: 1560, 
      engine: 'RB26DETT', 
      displacement: 2.6, 
      wheelbase: 2665,
      mileage: 28000,
      transmission: 'MANUAL',
      drivetrain: 'AWD',
      exteriorColor: 'BAYSIDE_BLUE',
      interiorColor: 'GREY_CLOTH',
      owners: 1,
      accidents: 0,
      year: 1999,
      bodyStyle: 'COUPE',
      fuelType: 'GASOLINE'
    },
    performance: { powerIndex: 65, gripCoefficient: 70, downforceBalance: 50 }
  },
  {
    id: 'FD3S RX7',
    name: 'FD3S RX7',
    platform: 'FD3S',
    version: '3.1.2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKOU7X9efFrTp-U1xzwrGk19L_T7kJ5lSo53spuMKLHoWY-JLSa4Xe9cNFgH9RHwHjFpKML4WT6BgvnYe9lrMr6iXl5zZAKIH6smMSTUZIF4-33V3O0cNxRQqaj9nr7pFGQJADsQ7Y5pcJmkYbh4NFfOZiYChCt5hjunwO0PxQY0xVtK9HHHs4iMJpZMvOAiG_ramA8WMrsqbTuhT0k4ZOFUkiR0NcqMCqD9BIzE08bLQPYCVqv_LLmM4b8O0Y81gegFpoQ4o10-Q',
    price: 35000,
    locked: true,
    specs: { 
      hp: 255, 
      weight: 1270, 
      engine: '13B-REW', 
      displacement: 1.3, 
      wheelbase: 2425,
      mileage: 65000,
      transmission: 'MANUAL',
      drivetrain: 'RWD',
      exteriorColor: 'CHASTE_WHITE',
      interiorColor: 'BLACK_CLOTH',
      owners: 3,
      accidents: 1,
      year: 1993,
      bodyStyle: 'COUPE',
      fuelType: 'GASOLINE'
    },
    performance: { powerIndex: 58, gripCoefficient: 75, downforceBalance: 40 }
  }
];

export const DRIVETRAIN_PARTS: Part[] = [
  {
    id: 'HKS_TURBO',
    name: 'HKS_GTIII-RS TURBO_KIT',
    brand: 'GARRETT G-SERIES',
    description: 'Twin-scroll architecture with precision ball bearings. Optimized for high-response peak delivery.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIomIxwRzp5wXaZThIsULtljEpLmkdGRWO10UlG25LZ_q-FgAd5hYuxWAG5vAZrXEMUGGmxyRYCxZ6vuJUnsRfj3YOE080RwvKNoe58lMt44mb6hOqg565pgIZrtlJtp2qYMadcS6WI9JneSaHczReOWcpY1kDfICXyfD2z9GcXntutbE9nPMF9Er9gysIVwhCjKtkoS0Jv1b-mhKmRnCrddUHi5CLD_F7m29YX89ea_yCrdzor2mN6WZO_UIq9q88nXaJVqmPaVY',
    price: 4850,
    confidence: 98.4,
    equipped: true,
    tags: ['CIRCUIT_RACING', 'TIME_ATTACK', 'STREET'],
    stats: [
      { label: 'Estimated Gain', value: '+184 HP', color: 'primary' },
      { label: 'Weight Delta', value: '+12.4 KG', color: 'secondary' }
    ]
  },
  {
    id: 'MOTEC_ECU',
    name: 'MOTEC_M150 ENGINE_MGMT',
    brand: 'MOTEC M150',
    description: 'Programmable standalone unit with active knock sensing and adaptive fuel mapping logic.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7tjmdXe4twjWuZz3dGt33opgzIlGEH4e7esxAlmifnUgMC_SjsMuQL9RKnvLugv6d4A5bMWt0UwpjmCLQ24BJJtBd-wdkTFMXLhwSm9XSdZkVE2Djc_G8JYFOhEz4bgyhDPI14x7tGCmIOrhXaSprVKD9ze0wwE1XH2vM8CxdGsHLbW0z0HuR-5zR4LFZQDWmga6DGAAJNN1CPMSMD6iHxuenLmWrZD4jJUh5ybhT3npli4LzC5skXrK-zeycpnUHOZbRrXBPB1s',
    price: 3200,
    confidence: 92.1,
    tags: ['CIRCUIT_RACING', 'TIME_ATTACK', 'DRAG_RACING', 'DRIFT'],
    stats: [
      { label: 'Efficiency', value: '+8.2%', color: 'primary' },
      { label: 'Sync Latency', value: '0.8 MS', color: 'secondary' }
    ]
  },
  {
    id: 'TITAN_EXHAUST',
    name: 'TITAN_RACE STRAIGHT_PIPE',
    brand: 'BREMBO GTR',
    description: 'Ultra-lightweight titanium alloy. Zero restriction design. Exhaust note peak 118dB.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOlo_7JofWSHGBmCu_5EShWj9NYUHP8595gWcPnxKS5CylpwyISy7Q37nxoHL0Ya21PP-s7CRM5alMqLkM8kia3zas_jh4YXa49eDOT45yGgK5rHvUnK1V2SEyETy8kp1KqsR9ErwBrZO-XlY8fXfpfmcCu0i888hZUb47-FdGvf2uEgz28h9AjuAHXwr5K_YVmHZJe2UD0KkftsiiUZ9z_l63ELHzZCxVI4Jfnh2FwPTmFoQOqv6vMfVCM-ojGDQhdzccFv7TOQ',
    price: 7400,
    confidence: 85.9,
    tags: ['TIME_ATTACK', 'DRAG_RACING', 'CIRCUIT_RACING'],
    stats: [
      { label: 'Flow Rate', value: '+22.5%', color: 'primary' },
      { label: 'Weight', value: '-18.0 KG', color: 'secondary' }
    ]
  },
  {
    id: 'BIG_TURBO_DRAG',
    name: 'PRECISION_GEN2 8685 TURBO',
    brand: 'PRECISION',
    description: 'Massive turbocharger designed for maximum peak power in drag racing applications.',
    image: 'https://picsum.photos/seed/turbo/400/400',
    price: 6200,
    confidence: 95.0,
    tags: ['DRAG_RACING'],
    stats: [
      { label: 'Estimated Gain', value: '+650 HP', color: 'primary' },
      { label: 'Boost Threshold', value: '5200 RPM', color: 'outline' }
    ]
  },
  {
    id: 'AERO_WING_TA',
    name: 'VOLTEX_TYPE_7 GT_WING',
    brand: 'VOLTEX',
    description: 'High-downforce carbon fiber wing for time attack dominance.',
    image: 'https://picsum.photos/seed/wing/400/400',
    price: 2800,
    confidence: 99.1,
    tags: ['TIME_ATTACK', 'CIRCUIT_RACING'],
    stats: [
      { label: 'Downforce', value: '+450 KG', color: 'primary' },
      { label: 'Drag Delta', value: '+12%', color: 'secondary' }
    ]
  },
  {
    id: 'DRIFT_KNUCKLES',
    name: 'WISEFAB_ANGLE_KIT',
    brand: 'WISEFAB',
    description: 'Extreme steering angle kit for competitive drifting.',
    image: 'https://picsum.photos/seed/knuckle/400/400',
    price: 1850,
    confidence: 97.5,
    tags: ['DRIFT'],
    stats: [
      { label: 'Angle', value: '65 DEG', color: 'primary' },
      { label: 'Ackermann', value: 'ADJUSTABLE', color: 'secondary' }
    ]
  }
];

export const LOGS: LogEntry[] = [
  { timestamp: '14:22:01', source: 'POST /sim/run/402', message: '200 OK', type: 'SUCCESS' },
  { timestamp: '14:22:04', source: 'UPLINK_SYNK', message: 'BUFFER_CLEARING', type: 'INFO' },
  { timestamp: '14:22:08', source: 'CALIBRATION_CHECK', message: 'ALL_SYSTEMS_NOMINAL', type: 'INFO' },
  { timestamp: '14:22:12', source: 'GET /telemetry/stream/v2', message: '200 OK', type: 'SUCCESS' },
  { timestamp: '14:22:15', source: 'WARNING', message: 'THERMAL_THROTTLING_CORE_04', type: 'WARNING' },
  { timestamp: '14:22:19', source: 'POST /sim/run/403', message: '200 OK', type: 'SUCCESS' },
  { timestamp: '14:22:22', source: 'INFO', message: 'RE-ROUTING_PACKETS_THRU_PROXY_01', type: 'INFO' },
  { timestamp: '14:22:25', source: 'PYTHON_EXT', message: 'RE-INITIALIZED', type: 'INFO' },
  { timestamp: '14:22:30', source: 'PING // PONG', message: '', type: 'INFO' }
];
