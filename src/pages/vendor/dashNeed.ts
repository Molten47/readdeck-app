// ── Types ─────────────────────────────────────────────────────────

export interface Stats {
  total_orders:     number;
  pending_orders:   number;
  todays_revenue:   number;
  total_revenue:    number;
  active_books:     number;
  low_stock_count?: number;
  has_bookstore?:   boolean;
  bookstore_id?:    string | null;
}

export interface VendorOrder {
  id:           string;
  status:       string;
  total_amount: number;
  item_count:   number;
  placed_at:    string;
  address:      string;
}

export interface GreetingResult {
  main:      string;
  sub:       string;
  isHoliday: boolean;
  icon:      'Sun' | 'Moon' | 'Sparkles';
}

// ── Status config ─────────────────────────────────────────────────

export const STATUS_LABEL: Record<string, string> = {
  pending:    'New Order',
  confirmed:  'Confirmed',
  preparing:  'Preparing',
  in_transit: 'On the way',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
};

export const STATUS_COLOR: Record<string, string> = {
  pending:    '#E8622A',
  confirmed:  '#3B82F6',
  preparing:  '#F59E0B',
  in_transit: '#8B5CF6',
  delivered:  '#22C55E',
  cancelled:  '#6B7280',
};

// ── Greeting engine ───────────────────────────────────────────────

const HOLIDAYS: Record<string, { main: string; sub: string }> = {
  '1-1':   { main: 'Happy New Year! 🎉',         sub: 'Hope your store has an amazing year ahead.' },
  '2-14':  { main: "Happy Valentine's Day 💝",    sub: 'Books make the most thoughtful gifts — your store is ready.' },
  '4-18':  { main: 'Happy Good Friday',            sub: 'A blessed long weekend to you.' },
  '4-20':  { main: 'Happy Easter! 🐣',             sub: 'Hope your weekend is joyful and your orders keep coming.' },
  '5-1':   { main: "Happy Workers' Day! 🙌",       sub: "Rest well — you've earned it." },
  '6-12':  { main: 'Happy Democracy Day!',          sub: "Celebrating Nigeria's democratic journey." },
  '10-1':  { main: 'Happy Independence Day! 🇳🇬', sub: 'Proud to serve Nigerian readers on this special day.' },
  '12-25': { main: 'Merry Christmas! 🎄',           sub: 'Warm wishes from Readdeck to you and yours.' },
  '12-26': { main: 'Happy Boxing Day!',             sub: 'Relax — your store keeps working even when you rest.' },
  '12-31': { main: "Happy New Year's Eve! 🥂",      sub: 'Last day of the year — finish strong.' },
};

const ISLAMIC_2026: Record<string, { main: string; sub: string }> = {
  '3-30': { main: 'Eid Mubarak! 🌙',     sub: 'Wishing you and your family a blessed Eid al-Fitr.' },
  '6-6':  { main: 'Eid Mubarak! 🌙',     sub: 'May this blessed Eid al-Adha bring peace and joy.' },
  '9-4':  { main: 'Happy Maulid al-Nabi', sub: 'Peace and blessings on this holy day.' },
};

export function buildGreeting(username?: string): GreetingResult {
  const now  = new Date();
  const m    = now.getMonth() + 1;
  const d    = now.getDate();
  const h    = now.getHours();
  const key  = `${m}-${d}`;
  const name = username ? `, ${username.split(' ')[0]}` : '';

  const holiday = HOLIDAYS[key] ?? ISLAMIC_2026[key];
  if (holiday) return { ...holiday, isHoliday: true, icon: 'Sparkles' };

  if (h >= 5  && h < 12) return { main: `Good morning${name}`,   sub: "Here's what needs your attention today.",     isHoliday: false, icon: 'Sun'  };
  if (h >= 12 && h < 17) return { main: `Good afternoon${name}`, sub: 'Stay on top of your orders.',                 isHoliday: false, icon: 'Sun'  };
  if (h >= 17 && h < 21) return { main: `Good evening${name}`,   sub: 'Wrapping up? Check your latest orders.',     isHoliday: false, icon: 'Moon' };
  return                         { main: `You're up late${name}`, sub: 'Night shift — your dashboard is always ready.', isHoliday: false, icon: 'Moon' };
}

// ── Framer helper ─────────────────────────────────────────────────

export const fadeUp = (delay: number) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { type: 'tween' as const, delay, duration: 0.35, ease: 'easeOut' as const },
});