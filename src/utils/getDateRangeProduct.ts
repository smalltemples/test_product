import type { Result } from '../types.js';

export const getDateRangeProductResult = (productPerDay: Result[]) => {
  // counts how many times each productName appears in the productPerDay array
  const countProductName = productPerDay.reduce<Record<string, number>>(
    (acc, { productName }) => {
      acc[productName] = (acc[productName] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const sortByCountDescThenAlpha = (
    [nameA, countA]: [string, number],
    [nameB, countB]: [string, number],
  ) => (countB !== countA ? countB - countA : nameA.localeCompare(nameB));

  const maxProduct =
    Object.entries(countProductName).sort(sortByCountDescThenAlpha)[0]?.[0] ??
    '';

  const from = productPerDay[0]?.date || '';
  const to = productPerDay[productPerDay.length - 1]?.date || '';

  return [
    ...productPerDay,
    {
      date: `${from} - ${to}`,
      productName: maxProduct,
    },
  ];
};
