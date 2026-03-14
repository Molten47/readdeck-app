import { useState, useEffect, useRef } from 'react';

export interface Testimonial {
  name: string;
  role: string;
  city: string;
  avatar: string;
  comment: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Amara Osei',
    role: 'Graduate student',
    city: 'Lagos',
    avatar: 'AO',
    comment: 'I ordered Atomic Habits at 9pm and it was at my door by 9:45. I genuinely could not believe it. Readdeck is doing something special.',
    rating: 5,
  },
  {
    name: 'Chidi Nwosu',
    role: 'Software Engineer',
    city: 'Abuja',
    avatar: 'CN',
    comment: 'Finally an app that understands that readers are serious people. The bookstore selection is excellent and delivery is always on time.',
    rating: 5,
  },
  {
    name: 'Fatima Aliyu',
    role: 'Book club host',
    city: 'Ibadan',
    avatar: 'FA',
    comment: 'Our book club orders through Readdeck every month. The experience is seamless — browsing, ordering, delivery. Everything just works.',
    rating: 5,
  },
  {
    name: 'Tolu Adeyemi',
    role: 'Entrepreneur',
    city: 'Lagos',
    avatar: 'TA',
    comment: 'I discovered so many Nigerian authors I had never read before. The curated picks feature is incredibly good. Highly recommend.',
    rating: 5,
  },
  {
    name: 'Emeka Okafor',
    role: 'University lecturer',
    city: 'Port Harcourt',
    avatar: 'EO',
    comment: 'My students now order their textbooks through Readdeck. Cheaper, faster and no more queuing at the campus bookshop.',
    rating: 5,
  },
  {
    name: 'Zainab Musa',
    role: 'Creative writer',
    city: 'Abuja',
    avatar: 'ZM',
    comment: 'The reading events feature is brilliant. I found a poetry circle two streets from my house. This app changed my social life.',
    rating: 5,
  },
];

export const useTestimonials = () => {
  const [active, setActive] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = TESTIMONIALS.length;

  const next = () => setActive((a) => (a + 1) % total);
  const prev = () => setActive((a) => (a - 1 + total) % total);
  const goTo = (i: number) => {
    setActive(i);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    intervalRef.current = setInterval(next, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, active]);

  return { active, next, prev, goTo, total };
};