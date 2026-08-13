export interface BulkOrder {
  id: string;
  orderNumber: string;
  recipientName: string;
  city: string;
  country: string;
  items: string;
  weight: string;
  source: 'CSV Upload';
  addedAt: number;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

const HEADER_ALIASES: Record<string, string[]> = {
  orderNumber: ['order', 'order#', 'order #', 'order number', 'ordernumber'],
  recipientName: ['recipient', 'recipient name', 'name', 'customer'],
  city: ['city', 'destination'],
  country: ['country'],
  items: ['items', 'item', 'description', 'product'],
  weight: ['weight'],
};

export function parseOrdersCsv(text: string): Omit<BulkOrder, 'id' | 'source' | 'addedAt'>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase());
  const colIndex = (field: keyof typeof HEADER_ALIASES) => {
    for (const alias of HEADER_ALIASES[field]) {
      const i = headers.indexOf(alias);
      if (i >= 0) return i;
    }
    return -1;
  };

  const idx = {
    orderNumber: colIndex('orderNumber'),
    recipientName: colIndex('recipientName'),
    city: colIndex('city'),
    country: colIndex('country'),
    items: colIndex('items'),
    weight: colIndex('weight'),
  };

  return lines.slice(1).map((line, i) => {
    const cols = parseCsvLine(line);
    const get = (ix: number) => (ix >= 0 ? (cols[ix] || '').trim() : '');
    return {
      orderNumber: get(idx.orderNumber) || `CSV-${i + 1}`,
      recipientName: get(idx.recipientName),
      city: get(idx.city),
      country: get(idx.country),
      items: get(idx.items),
      weight: get(idx.weight),
    };
  });
}
