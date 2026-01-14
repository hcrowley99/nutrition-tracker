/**
 * Unit Conversion Utility
 * Converts between common weight and volume units
 * Handles various unit formats from USDA API
 */

// Conversion factors to grams (base unit for weight)
export const WEIGHT_CONVERSIONS = {
  g: 1,
  oz: 28.3495,
  lb: 453.592,
  kg: 1000,
  mg: 0.001,
};

// Conversion factors to ml (base unit for volume)
export const VOLUME_CONVERSIONS = {
  ml: 1,
  cup: 240,
  cups: 240,
  tbsp: 15,
  tsp: 5,
  'fl oz': 29.5735,
  l: 1000,
  liter: 1000,
  liters: 1000,
  pint: 473.176,
  quart: 946.353,
  gallon: 3785.41,
};

// Map USDA API unit codes and variations to our standard units
const UNIT_ALIASES = {
  // Weight aliases
  'grm': 'g',
  'gram': 'g',
  'grams': 'g',
  'g': 'g',
  'ounce': 'oz',
  'ounces': 'oz',
  'oz': 'oz',
  'pound': 'lb',
  'pounds': 'lb',
  'lbs': 'lb',
  'lb': 'lb',
  'kilogram': 'kg',
  'kilograms': 'kg',
  'kg': 'kg',
  'milligram': 'mg',
  'milligrams': 'mg',
  'mg': 'mg',

  // Volume aliases
  'mlt': 'ml',
  'milliliter': 'ml',
  'milliliters': 'ml',
  'ml': 'ml',
  'cup': 'cup',
  'cups': 'cup',
  'c': 'cup',
  'tablespoon': 'tbsp',
  'tablespoons': 'tbsp',
  'tbsp': 'tbsp',
  'tbs': 'tbsp',
  'tb': 'tbsp',
  'teaspoon': 'tsp',
  'teaspoons': 'tsp',
  'tsp': 'tsp',
  'ts': 'tsp',
  'fluid ounce': 'fl oz',
  'fluid ounces': 'fl oz',
  'fl oz': 'fl oz',
  'floz': 'fl oz',
  'fl. oz': 'fl oz',
  'fl. oz.': 'fl oz',
  'liter': 'l',
  'liters': 'l',
  'litre': 'l',
  'litres': 'l',
  'l': 'l',
  'pint': 'pint',
  'pints': 'pint',
  'pt': 'pint',
  'quart': 'quart',
  'quarts': 'quart',
  'qt': 'quart',
  'gallon': 'gallon',
  'gallons': 'gallon',
  'gal': 'gallon',
};

/**
 * Normalize a unit string to our standard format
 * Handles USDA API codes, plurals, and various spellings
 * @param {string} unit - Unit to normalize
 * @returns {string} Normalized unit or original if not recognized
 */
export function normalizeUnit(unit) {
  if (!unit) return unit;
  const lowered = unit.toLowerCase().trim();
  return UNIT_ALIASES[lowered] || lowered;
}

/**
 * Get the display name for a unit (user-friendly format)
 * @param {string} unit - Normalized unit
 * @returns {string} Display-friendly unit name
 */
export function getUnitDisplayName(unit) {
  const displayNames = {
    g: 'g',
    oz: 'oz',
    lb: 'lb',
    kg: 'kg',
    mg: 'mg',
    ml: 'ml',
    cup: 'cup',
    tbsp: 'tbsp',
    tsp: 'tsp',
    'fl oz': 'fl oz',
    l: 'L',
    pint: 'pint',
    quart: 'quart',
    gallon: 'gal',
  };
  return displayNames[unit] || unit;
}

/**
 * Determine if a unit is a weight unit
 * @param {string} unit - Unit to check (will be normalized)
 * @returns {boolean}
 */
export function isWeightUnit(unit) {
  const normalized = normalizeUnit(unit);
  return normalized in WEIGHT_CONVERSIONS;
}

/**
 * Determine if a unit is a volume unit
 * @param {string} unit - Unit to check (will be normalized)
 * @returns {boolean}
 */
export function isVolumeUnit(unit) {
  const normalized = normalizeUnit(unit);
  return normalized in VOLUME_CONVERSIONS;
}

/**
 * Convert from one unit to another
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit (will be normalized)
 * @param {string} toUnit - Target unit (will be normalized)
 * @returns {number|null} Converted value or null if incompatible units
 */
export function convertUnit(value, fromUnit, toUnit) {
  const normalizedFrom = normalizeUnit(fromUnit);
  const normalizedTo = normalizeUnit(toUnit);

  // Same unit - no conversion needed
  if (normalizedFrom === normalizedTo) {
    return value;
  }

  // Check if both are weight units
  if (isWeightUnit(normalizedFrom) && isWeightUnit(normalizedTo)) {
    const grams = value * WEIGHT_CONVERSIONS[normalizedFrom];
    return grams / WEIGHT_CONVERSIONS[normalizedTo];
  }

  // Check if both are volume units
  if (isVolumeUnit(normalizedFrom) && isVolumeUnit(normalizedTo)) {
    const ml = value * VOLUME_CONVERSIONS[normalizedFrom];
    return ml / VOLUME_CONVERSIONS[normalizedTo];
  }

  // Incompatible units (e.g., trying to convert g to ml)
  return null;
}

// Standard units to show in dropdowns (user-friendly subset)
const STANDARD_WEIGHT_UNITS = ['g', 'oz', 'lb', 'kg'];
const STANDARD_VOLUME_UNITS = ['ml', 'cup', 'tbsp', 'tsp', 'fl oz', 'l'];

/**
 * Get compatible units for conversion
 * @param {string} baseUnit - Starting unit (will be normalized)
 * @returns {Array} Array of compatible unit strings (user-friendly subset)
 */
export function getCompatibleUnits(baseUnit) {
  const normalized = normalizeUnit(baseUnit);
  if (isWeightUnit(normalized)) {
    return STANDARD_WEIGHT_UNITS;
  }
  if (isVolumeUnit(normalized)) {
    return STANDARD_VOLUME_UNITS;
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
