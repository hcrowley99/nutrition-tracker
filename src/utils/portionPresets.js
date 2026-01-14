/**
 * Portion Presets Utility
 * Generates smart portion presets based on food type and serving unit
 */

import { isWeightUnit, isVolumeUnit } from './unitConversions';

/**
 * Get portion presets for a food item
 * @param {Object} food - Food object with servingSize and servingUnit
 * @returns {Array} Array of preset objects with label, amount, and unit
 */
export function getPortionPresets(food) {
  const presets = [];
  const baseUnit = food.servingUnit;
  const baseSize = food.servingSize;

  // Standard serving multiples (always available)
  presets.push({ label: '½', amount: baseSize * 0.5, unit: baseUnit });
  presets.push({ label: '1', amount: baseSize, unit: baseUnit });
  presets.push({ label: '1.5', amount: baseSize * 1.5, unit: baseUnit });
  presets.push({ label: '2', amount: baseSize * 2, unit: baseUnit });

  // Add common weight presets for weight-based foods
  if (isWeightUnit(baseUnit)) {
    if (baseUnit !== 'oz') {
      presets.push({ label: '4 oz', amount: 4, unit: 'oz' });
    }
    if (baseUnit !== 'g' || baseSize !== 100) {
      presets.push({ label: '100g', amount: 100, unit: 'g' });
    }
  }

  // Add common volume presets for volume-based foods
  if (isVolumeUnit(baseUnit)) {
    if (baseUnit !== 'cup') {
      presets.push({ label: '1 cup', amount: 1, unit: 'cup' });
      presets.push({ label: '½ cup', amount: 0.5, unit: 'cup' });
    }
  }

  return presets;
}

/**
 * Get smart step size for quantity adjustments based on unit
 * @param {string} unit - The current unit
 * @returns {number} Appropriate step size for the unit
 */
export function getStepSize(unit) {
  const steps = {
    g: 10,
    oz: 0.5,
    lb: 0.25,
    kg: 0.1,
    ml: 25,
    cup: 0.25,
    tbsp: 0.5,
    tsp: 0.5,
    'fl oz': 1,
    l: 0.1,
  };
  return steps[unit] || 1;
}
