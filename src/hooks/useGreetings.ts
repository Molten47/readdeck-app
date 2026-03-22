import { useMemo } from 'react';

interface Greeting {
  main:       string;
  sub:        string;
  isHoliday:  boolean;
}

const HOLIDAYS: Record<string, { main: string; sub: string }> = {
  '1-1':   { main: 'Happy New Year! 🎉',        sub: 'Wishing you an amazing year. Find your first great read of the year.' },
  '2-14':  { main: 'Happy Valentine\'s Day 💝',  sub: 'Share the love — books make the most thoughtful gifts.' },
  '4-18':  { main: 'Happy Good Friday',           sub: 'A blessed long weekend to you.' },
  '4-20':  { main: 'Happy Easter! 🐣',            sub: 'Hope your weekend is full of joy and great reads.' },
  '5-1':   { main: 'Happy Workers\' Day! 🙌',    sub: 'Rest well — you\'ve earned it.' },
  '6-12':  { main: 'Happy Democracy Day!',         sub: 'Celebrating Nigeria\'s democratic journey.' },
  '10-1':  { main: 'Happy Independence Day! 🇳🇬', sub: 'Proud to serve Nigerian readers on this special day.' },
  '12-25': { main: 'Merry Christmas! 🎄',          sub: 'Warm wishes from Readdeck to you and yours.' },
  '12-26': { main: 'Happy Boxing Day!',             sub: 'Relax, recharge, and maybe start a new book.' },
  '12-31': { main: 'Happy New Year\'s Eve! 🥂',   sub: 'Last day of the year — make it count.' },
};

// Islamic holidays — approximate Gregorian dates, updated yearly
// These shift ~11 days earlier each year so update annually
const ISLAMIC_2026: Record<string, { main: string; sub: string }> = {
  '3-30': { main: 'Eid Mubarak! 🌙',    sub: 'Wishing you and your family a blessed Eid al-Fitr.' },
  '6-6':  { main: 'Eid Mubarak! 🌙',    sub: 'May this blessed Eid al-Adha bring peace and joy.' },
  '9-4':  { main: 'Happy Maulid al-Nabi', sub: 'Peace and blessings on this holy day.' },
};

export function useGreeting(username?: string): Greeting {
  return useMemo(() => {
    const now  = new Date();
    const m    = now.getMonth() + 1;
    const d    = now.getDate();
    const h    = now.getHours();
    const key  = `${m}-${d}`;
    const name = username ? `, ${username}` : '';

    const holiday = HOLIDAYS[key] ?? ISLAMIC_2026[key];
    if (holiday) return { ...holiday, isHoliday: true };

    if (h >= 5  && h < 12) return { main: `Good morning${name} 👋`, sub: 'Ready to find your next great read?',           isHoliday: false };
    if (h >= 12 && h < 17) return { main: `Good afternoon${name}`,   sub: 'Take a break with a good book.',                isHoliday: false };
    if (h >= 17 && h < 21) return { main: `Good evening${name}`,     sub: 'Wind down with something great to read tonight.', isHoliday: false };
    return                         { main: `You\'re up late${name}`,  sub: 'Night owl or early bird — books are always ready.', isHoliday: false };
  }, [username]);
}