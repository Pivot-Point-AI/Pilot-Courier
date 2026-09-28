// One physical factor for both unit systems: 5000 cm³/kg is equivalent to 139 in³/lb,
// so the same box shows the same volumetric weight in metric and imperial.
// Display estimate only; each carrier applies its own divisor when billing.
export const DIM_DIVISOR = { cm: 5000, in: 139 } as const;

export function volumetricWeight(length: unknown, width: unknown, height: unknown, unit: 'cm' | 'in'): number {
  return (Number(length) || 0) * (Number(width) || 0) * (Number(height) || 0) / DIM_DIVISOR[unit];
}
