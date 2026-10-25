export function isArrayValidator<T>(value: any): value is T[] {
  return Array.isArray(value);
}

export function isObjectValidator<T extends object>(value: any): value is T {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isStringValidator(value: any): value is string {
  return typeof value === 'string';
}

export function isNumberValidator(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}
