/**
 * Unit Conversion Utility
 * Converts between common weight and volume units
 */

// Conversion factors to grams (base unit for weight)
export const WEIGHT_CONVERSIONS = {
  g: 1,
  oz: 28.35,
  lb: 453.592,
  kg: 1000,
};

// Conversion factors to ml (base unit for volume)
export const VOLUME_CONVERSIONS = {
  ml: 1,
  cup: 240,
  tbsp: 15,
  tsp: 5,
  'fl oz': 29.5735,
  l: 1000,
};

/**
 * Determine if a unit is a weight unit
 * @param {string} unit - Unit to check
 * @returns {boolean}
 */
export function isWeightUnit(unit) {
  return unit in WEIGHT_CONVERSIONS;
}

/**
 * Determine if a unit is a volume unit
 * @param {string} unit - Unit to check
 * @returns {boolean}
 */
export function isVolumeUnit(unit) {
  return unit in VOLUME_CONVERSIONS;
}

/**
 * Convert from one unit to another
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number|null} Converted value or null if incompatible units
 */
export function convertUnit(value, fromUnit, toUnit) {
  // Same unit - no conversion needed
  if (fromUnit === toUnit) {
    return value;
  }

  // Check if both are weight units
  if (isWeightUnit(fromUnit) && isWeightUnit(toUnit)) {
    const grams = value * WEIGHT_CONVERSIONS[fromUnit];
    return grams / WEIGHT_CONVERSIONS[toUnit];
  }

  // Check if both are volume units
  if (isVolumeUnit(fromUnit) && isVolumeUnit(toUnit)) {
    const ml = value * VOLUME_CONVERSIONS[fromUnit];
    return ml / VOLUME_CONVERSIONS[toUnit];
  }

  // Incompatible units (e.g., trying to convert g to ml)
  return null;
}

/**
 * Get compatible units for conversion
 * @param {string} baseUnit - Starting unit
 * @returns {Array} Array of compatible unit strings
 */
export function getCompatibleUnits(baseUnit) {
  if (isWeightUnit(baseUnit)) {
    return Object.keys(WEIGHT_CONVERSIONS);
  }
  if (isVolumeUnit(baseUnit)) {
    return Object.keys(VOLUME_CONVERSIONS);
  }
  // No conversions available for this unit
  return [baseUnit];
}

/**
 * Format a conversion factor for display
 * Simplifies the ratio for better readability
 *
 * @param {number} value - Conversion factor
 * @returns {string} Formatted string (e.g., "1:28.35" or "28:1")
 */
export function formatConversionFactor(value) {
  if (value === null || value === undefined) return '';
  if (value === 1) return '1:1';
  if (value < 0.01) return `1:${Math.round(1 / value)}`;
  if (value < 1) return `${value.toFixed(2)}:1`;
  return `${Math.round(value * 100) / 100}:1`;
}
