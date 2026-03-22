import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';
import { useEvents } from './useEvents';
import { useTheme } from '../../context/ThemeContext';
import './events.css';

const EventsPage: React.FC = () => {
  const { events, loading, error, freeOnly, setFreeOnly, upcoming, setUpcoming } = useEvents();
  const { isDark } = useTheme();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-NG', {
      weekday: 'short', day: 'numeric', month: 'short',
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-NG', {
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className={`ev-page${isDark ? '' : ' ev-page--light'}`}>

      {/* ── Header ── */}
      <div className="ev-header">
        <div className="ev-header__inner">
          <h1 className="ev-header__title">Events</h1>
          <p className="ev-header__sub">Book fairs, readings, and author meetups near you</p>

          {/* ── Toggles ── */}
          <div className="ev-toggles">
            <button
              className={`ev-toggle${upcoming ? ' ev-toggle--active' : ''}`}
              onClick={() => setUpcoming(true)}
            >
              Upcoming
            </button>
            <button
              className={`ev-toggle${!upcoming ? ' ev-toggle--active' : ''}`}
              onClick={() => setUpcoming(false)}
            >
              All events
            </button>
            <div className="ev-toggle-divider" />
            <button
              className={`ev-toggle${freeOnly ? ' ev-toggle--active' : ''}`}
              onClick={() => setFreeOnly(f => !f)}
            >
              <Ticket size={12} />
              Free only
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="ev-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ev-skeleton" />
          ))
        ) : error || events.length === 0 ? (
          <div className="ev-empty">
            <Calendar size={32} color="#8A7968" />
            <p>{error ?? 'No events found'}</p>
          </div>
        ) : (
          events.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="ev-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: 'easeOut' }}
            >
              {/* Cover */}
              <div className="ev-card__cover">
                {ev.cover_url
                  ? <img src={ev.cover_url} alt={ev.title} />
                  : <div className="ev-card__cover-placeholder"><Calendar size={24} color="#8A7968" /></div>
                }
                <span className={`ev-card__price-badge${ev.is_free ? ' ev-card__price-badge--free' : ''}`}>
                  {ev.is_free ? 'Free' : `₦${ev.price?.toLocaleString()}`}
                </span>
              </div>

              {/* Body */}
              <div className="ev-card__body">
                <p className="ev-card__title">{ev.title}</p>
                {ev.description && (
                  <p className="ev-card__desc">{ev.description}</p>
                )}
                <div className="ev-card__meta">
                  <span className="ev-card__meta-item">
                    <Calendar size={11} color="#8A7968" />
                    {formatDate(ev.starts_at)}
                  </span>
                  <span className="ev-card__meta-item">
                    <Clock size={11} color="#8A7968" />
                    {formatTime(ev.starts_at)}
                  </span>
                  <span className="ev-card__meta-item">
                    <MapPin size={11} color="#8A7968" />
                    {ev.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
};

export default EventsPage;