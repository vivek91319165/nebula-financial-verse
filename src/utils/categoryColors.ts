
export const categoryColors = {
  food: '#F97316', // Orange
  transport: '#0EA5E9', // Blue
  entertainment: '#9b87f5', // Purple
  utilities: '#F2FCE2', // Soft Green
  housing: '#FEC6A1', // Soft Orange
  shopping: '#D946EF', // Magenta Pink
  health: '#FFDEE2', // Soft Pink
  education: '#D3E4FD', // Soft Blue
  other: '#7E69AB', // Secondary Purple
} as const;

export type ExpenseCategory = keyof typeof categoryColors;
