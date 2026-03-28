/**
 * Crop Database
 * Local reference data for offline mode
 * @module utils/cropDatabase
 */

import { Crop } from '../types';

/**
 * Pre-loaded crop data for offline use
 * MVP: 5 crops for Kashmir region
 */
export const LOCAL_CROPS: Crop[] = [
  {
    id: 'crop-wheat',
    name: 'Wheat',
    nameUrdu: 'گندم',
    namePunjabi: 'ਕਣਕ',
    region: 'Kashmir',
    season: 'rabi',
    plantingMonth: 10,
    harvestMonth: 4,
    waterNeeds: 'medium',
    soilType: 'Loamy',
  },
  {
    id: 'crop-rice',
    name: 'Rice',
    nameUrdu: 'چاول',
    namePunjabi: 'ਚੌਲ',
    region: 'Kashmir',
    season: 'kharif',
    plantingMonth: 6,
    harvestMonth: 10,
    waterNeeds: 'high',
    soilType: 'Clay',
  },
  {
    id: 'crop-corn',
    name: 'Corn (Maize)',
    nameUrdu: 'مکئی',
    namePunjabi: 'ਮੱਕੀ',
    region: 'Kashmir',
    season: 'kharif',
    plantingMonth: 5,
    harvestMonth: 9,
    waterNeeds: 'medium',
    soilType: 'Sandy Loam',
  },
  {
    id: 'crop-tomato',
    name: 'Tomatoes',
    nameUrdu: 'ٹماٹر',
    namePunjabi: 'ਟਮਾਟਰ',
    region: 'Kashmir',
    season: 'kharif',
    plantingMonth: 3,
    harvestMonth: 8,
    waterNeeds: 'medium',
    soilType: 'Sandy Loam',
  },
  {
    id: 'crop-apple',
    name: 'Apples',
    nameUrdu: 'سیب',
    namePunjabi: 'ਸੇਬ',
    region: 'Kashmir',
    season: 'kharif',
    plantingMonth: 3,
    harvestMonth: 9,
    waterNeeds: 'medium',
    soilType: 'Loamy',
  },
];

/**
 * Get crop by ID from local database
 */
export function getCropById(id: string): Crop | undefined {
  return LOCAL_CROPS.find((crop) => crop.id === id);
}

/**
 * Filter crops by season
 */
export function getCropsBySeason(season: string): Crop[] {
  return LOCAL_CROPS.filter((crop) => crop.season === season);
}

/**
 * Filter crops by region
 */
export function getCropsByRegion(region: string): Crop[] {
  return LOCAL_CROPS.filter((crop) =>
    crop.region.toLowerCase().includes(region.toLowerCase())
  );
}
