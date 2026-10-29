export interface GeneratedVariant {
  title: string;
  sku: string;
  price: string;
  inventoryQuantity: number;
  options: Record<string, string>;
}

export function generateVariantMatrix(
  baseSku: string,
  basePrice: string,
  options: Record<string, string[]>
): GeneratedVariant[] {
  const keys = Object.keys(options).filter(k => options[k] && options[k].length > 0);

  if (keys.length === 0) {
    return [
      {
        title: "Default Title",
        sku: `${baseSku || "PROD"}-DEFAULT`,
        price: basePrice || "0.00",
        inventoryQuantity: 0,
        options: {}
      }
    ];
  }

  // Cartesian product algorithm
  function cartesian(arr: string[][]): string[][] {
    return arr.reduce<string[][]>(
      (acc, curr) => acc.flatMap(x => curr.map(y => [...x, y])),
      [[]]
    );
  }

  const valuesArray = keys.map(k => options[k]);
  const combinations = cartesian(valuesArray);

  return combinations.map(combo => {
    const optRecord: Record<string, string> = {};
    keys.forEach((key, idx) => {
      optRecord[key] = combo[idx];
    });

    const title = combo.join(" / ");
    const skuSuffix = combo
      .map(part => part.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
      .join("-");

    const cleanBaseSku = (baseSku || "PROD").trim().toUpperCase();

    return {
      title,
      sku: `${cleanBaseSku}-${skuSuffix}`,
      price: basePrice || "0.00",
      inventoryQuantity: 0,
      options: optRecord
    };
  });
}
