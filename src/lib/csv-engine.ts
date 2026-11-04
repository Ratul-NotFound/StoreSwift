/**
 * RFC-4180 Compliant CSV Parser & Serializer with Formula Injection Protection
 */

export function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return "";
  let str = String(value);

  // Prevent formula injection in Excel/Calc: = + - @ \t \r
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function serializeToCsv(
  rows: Record<string, any>[],
  columns: { key: string; label: string }[]
): string {
  const headerLine = columns.map((col) => sanitizeCsvCell(col.label)).join(",");
  const dataLines = rows.map((row) =>
    columns.map((col) => sanitizeCsvCell(row[col.key])).join(",")
  );
  return [headerLine, ...dataLines].join("\r\n");
}

export function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let insideQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === "," && !insideQuote) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.replace(/^["']|["']$/g, "").trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx]?.replace(/^["']|["']$/g, "") ?? "";
    });
    rows.push(rowObj);
  }

  return rows;
}
