/**
 * Utility functions for chart formatting and tooltips
 */

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as currency with decimals
 */
export function formatCurrencyDetailed(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a number with decimals
 */
export function formatNumberDetailed(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Detect the type of data based on key name and format accordingly
 */
export function formatValue(key: string, value: number): string {
  const lowerKey = key.toLowerCase();
  
  // Currency formatting
  if (lowerKey.includes('revenue') || 
      lowerKey.includes('cost') || 
      lowerKey.includes('price') || 
      lowerKey.includes('value') || 
      lowerKey.includes('spend') ||
      lowerKey.includes('budget') ||
      lowerKey.includes('margin') && !lowerKey.includes('percentage') ||
      lowerKey.includes('profit') ||
      lowerKey.includes('amount') ||
      lowerKey.includes('salary') ||
      lowerKey.includes('payment')) {
    return formatCurrency(value);
  }
  
  // Percentage formatting
  if (lowerKey.includes('percentage') || 
      lowerKey.includes('rate') || 
      lowerKey.includes('utilization') ||
      lowerKey.includes('compliance') ||
      lowerKey.includes('score') && value <= 100) {
    return formatPercentage(value);
  }
  
  // Hours formatting
  if (lowerKey.includes('hours')) {
    return `${formatNumberDetailed(value, 1)} hrs`;
  }
  
  // Count formatting
  if (lowerKey.includes('count') || lowerKey.includes('number')) {
    return formatNumber(value);
  }
  
  // Default: number with decimals if needed
  if (Number.isInteger(value)) {
    return formatNumber(value);
  }
  
  return formatNumberDetailed(value, 2);
}

/**
 * Get a human-readable label from a camelCase or snake_case key
 */
export function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}
