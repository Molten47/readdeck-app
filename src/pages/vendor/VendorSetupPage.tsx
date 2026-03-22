import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, MapPin, Palette, Truck,
  Globe, Instagram, ChevronRight, ChevronLeft,
  Loader, CheckCircle, Clock, Package,
} from 'lucide-react';
import { useVendorSetup, GENRE_OPTIONS, EMOJI_OPTIONS, COLOR_OPTIONS } from './useVendor';
import { useTheme } from '../../context/ThemeContext';
import './vendorSetup.css';

const STEPS = [
  { icon: MapPin,  label: 'Location'   },
  { icon: Palette, label: 'Identity'   },
  { icon: Truck,   label: 'Operations' },
  { icon: Globe,   label: 'Socials'    },
];

const StorePreview: React.FC<{
  name:         string;
  address:      string;
  city:         string;
  emoji:        string;
  color:        string;
  deliveryFee:  string;
  deliveryTime: string;
  genres:       string[];
}> = ({ name, address, city, emoji, color, deliveryFee, deliveryTime, genres }) => (
  <div className="vs-preview">
    <p className="vs-preview__label">Live preview</p>
    <div className="vs-preview__card" style={{ background: color }}>
      <div className="vs-preview__banner">
        <span className="vs-preview__emoji">{emoji}</span>
      </div>
      <div className="vs-preview__body">
        <p className="vs-preview__name">{name || 'Your Store Name'}</p>
        <p className="vs-preview__address">
          <MapPin size={10} /> {address || 'Store address'}{city ? `, ${city}` : ''}
        </p>
        {genres.length > 0 && (
          <div className="vs-preview__genres">
            {genres.slice(0, 3).map(g => (
              <span key={g} className="vs-preview__genre">{g}</span>
            ))}
            {genres.length > 3 && (
              <span className="vs-preview__genre">+{genres.length - 3}</span>
            )}
          </div>
        )}
        <div className="vs-preview__meta">
          <span><Truck size={10} /> ₦{deliveryFee || '0'}</span>
          <span><Clock size={10} /> {deliveryTime || '?'} min</span>
        </div>
      </div>
    </div>
  </div>
);

const VendorSetupPage: React.FC = () => {
  const { isDark } = useTheme();
  const {
    step, next, back,
    form, update, toggleGenre, setEmoji, setColor,
    canNext, submitting, error, success,
    submit,
  } = useVendorSetup();

  const slide = {
    initial:    { opacity: 0, x: 24  },
    animate:    { opacity: 1, x: 0   },
    exit:       { opacity: 0, x: -24 },
    transition: { type: 'tween' as const, duration: 0.25, ease: 'easeOut' as const },
  };

  return (
    <div className={`vs-page${isDark ? '' : ' vs-page--light'}`}>
      <div className="vs-inner">

        {/* ── Left panel ── */}
        <div className="vs-left">
          <div className="vs-left__header">
            <div className="vs-left__badge">
              <Store size={13} color="#E8622A" />
              Store setup
            </div>
            <h1 className="vs-left__title">
              Build your<br />
              <span>bookstore</span>
            </h1>
            <p className="vs-left__sub">
              You're approved. Now let's set up your store so readers can find and order from you.
            </p>
          </div>

          <div className="vs-steps">
            {STEPS.map((s, i) => {
              const n       = i + 1;
              const done    = step > n;
              const current = step === n;
              return (
                <div
                  key={s.label}
                  className={`vs-step${done ? ' vs-step--done' : current ? ' vs-step--active' : ''}`}
                >
                  <div className="vs-step__dot">
                    {done ? <CheckCircle size={14} /> : <s.icon size={14} />}
                  </div>
                  <div className="vs-step__info">
                    <p className="vs-step__num">Step {n}</p>
                    <p className="vs-step__label">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <StorePreview
            name={form.name}
            address={form.address}
            city={form.city}
            emoji={form.image_emoji}
            color={form.banner_color}
            deliveryFee={form.delivery_fee}
            deliveryTime={form.delivery_time_minutes}
            genres={form.genres}
          />
        </div>

        {/* ── Right panel ── */}
        <div className="vs-right">
          <div className="vs-form-wrap">

            <div className="vs-progress-bar">
              <div
                className="vs-progress-bar__fill"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div key="step1" className="vs-form" {...slide}>
                  <h2 className="vs-form__title">Where is your store?</h2>
                  <p className="vs-form__sub">This is how readers will find you on the map.</p>
                  <div className="vs-field">
                    <label className="vs-field__label">Store name <span>*</span></label>
                    <input className="vs-field__input" placeholder="e.g. Pages & Pages Bookstore" value={form.name} onChange={update('name')} />
                  </div>
                  <div className="vs-field">
                    <label className="vs-field__label">Street address <span>*</span></label>
                    <input className="vs-field__input" placeholder="e.g. 14 Allen Avenue" value={form.address} onChange={update('address')} />
                  </div>
                  <div className="vs-row">
                    <div className="vs-field">
                      <label className="vs-field__label">City <span>*</span></label>
                      <input className="vs-field__input" placeholder="Lagos" value={form.city} onChange={update('city')} />
                    </div>
                    <div className="vs-field">
                      <label className="vs-field__label">District / Area <span>*</span></label>
                      <input className="vs-field__input" placeholder="Ikeja" value={form.district} onChange={update('district')} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" className="vs-form" {...slide}>
                  <h2 className="vs-form__title">Tell readers about your store</h2>
                  <p className="vs-form__sub">This shows on your storefront page.</p>
                  <div className="vs-field">
                    <label className="vs-field__label">Store description <span>*</span></label>
                    <textarea className="vs-field__input vs-field__textarea" placeholder="What makes your store special? What do you stock?" value={form.description} onChange={update('description')} rows={3} />
                  </div>
                  <div className="vs-field">
                    <label className="vs-field__label">
                      Genres you stock <span>*</span>
                      <span className="vs-field__hint"> — pick up to 6</span>
                    </label>
                    <div className="vs-genre-grid">
                      {GENRE_OPTIONS.map(genre => (
                        <button key={genre} type="button"
                          className={`vs-genre-chip${form.genres.includes(genre) ? ' vs-genre-chip--active' : ''}`}
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="vs-field">
                    <label className="vs-field__label">Store icon</label>
                    <div className="vs-emoji-grid">
                      {EMOJI_OPTIONS.map(e => (
                        <button key={e} type="button"
                          className={`vs-emoji-btn${form.image_emoji === e ? ' vs-emoji-btn--active' : ''}`}
                          onClick={() => setEmoji(e)}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="vs-field">
                    <label className="vs-field__label">Banner colour</label>
                    <div className="vs-color-grid">
                      {COLOR_OPTIONS.map(c => (
                        <button key={c} type="button"
                          className={`vs-color-btn${form.banner_color === c ? ' vs-color-btn--active' : ''}`}
                          style={{ background: c }}
                          onClick={() => setColor(c)}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" className="vs-form" {...slide}>
                  <h2 className="vs-form__title">How do you operate?</h2>
                  <p className="vs-form__sub">Readers see this before placing an order.</p>
                  <div className="vs-row">
                    <div className="vs-field">
                      <label className="vs-field__label">
                        <Package size={12} color="#8A7968" /> Delivery fee (₦) <span>*</span>
                      </label>
                      <input className="vs-field__input" type="number" placeholder="500" value={form.delivery_fee} onChange={update('delivery_fee')} />
                    </div>
                    <div className="vs-field">
                      <label className="vs-field__label">Minimum order (₦) <span>*</span></label>
                      <input className="vs-field__input" type="number" placeholder="1000" value={form.minimum_order} onChange={update('minimum_order')} />
                    </div>
                  </div>
                  <div className="vs-field">
                    <label className="vs-field__label">
                      <Truck size={12} color="#8A7968" /> Estimated delivery time (minutes) <span>*</span>
                    </label>
                    <input className="vs-field__input" type="number" placeholder="30" value={form.delivery_time_minutes} onChange={update('delivery_time_minutes')} />
                    <p className="vs-field__hint-text">How long after confirmation does delivery take?</p>
                  </div>
                  <div className="vs-field">
                    <label className="vs-field__label">
                      <Clock size={12} color="#8A7968" /> Opening hours <span>*</span>
                    </label>
                    <input className="vs-field__input" placeholder="Mon–Sat: 9am–7pm, Sun: 12pm–5pm" value={form.opening_hours} onChange={update('opening_hours')} />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" className="vs-form" {...slide}>
                  <h2 className="vs-form__title">One last thing</h2>
                  <p className="vs-form__sub">
                    Optional — readers love seeing your social presence. You can add these later too.
                  </p>
                  <div className="vs-field">
                    <label className="vs-field__label">
                      <Instagram size={12} color="#8A7968" /> Instagram handle
                    </label>
                    <div className="vs-input-prefix">
                      <span className="vs-input-prefix__at">@</span>
                      <input
                        className="vs-field__input vs-field__input--prefixed"
                        placeholder="yourstorehandle"
                        value={form.instagram.replace('@', '')}
                        onChange={update('instagram')}
                      />
                    </div>
                  </div>
                  <div className="vs-field">
                    <label className="vs-field__label">
                      <Globe size={12} color="#8A7968" /> Website
                    </label>
                    <input className="vs-field__input" placeholder="https://yourbookstore.com" value={form.website} onChange={update('website')} />
                  </div>
                  <div className="vs-summary">
                    <p className="vs-summary__label">You're about to launch:</p>
                    <div className="vs-summary__row">
                      <Store size={14} color="#8A7968" />
                      <span>{form.name}</span>
                    </div>
                    <div className="vs-summary__row">
                      <MapPin size={14} color="#8A7968" />
                      <span>{form.address}, {form.district}, {form.city}</span>
                    </div>
                    <div className="vs-summary__row">
                      <Truck size={14} color="#8A7968" />
                      <span>₦{form.delivery_fee} delivery · {form.delivery_time_minutes} min</span>
                    </div>
                    <div className="vs-summary__row">
                      <Package size={14} color="#8A7968" />
                      <span>{form.genres.join(', ')}</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {error && (
              <motion.p className="vs-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <div className="vs-nav">
              {step > 1 && (
                <button className="vs-btn vs-btn--ghost" onClick={back}>
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < 4 ? (
                <button
                  className="vs-btn vs-btn--primary"
                  onClick={next}
                  disabled={!canNext()}
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  className="vs-btn vs-btn--primary vs-btn--launch"
                  onClick={submit}
                  disabled={submitting || success}
                >
                  {success
                    ? <><CheckCircle size={15} /> Store launched! Redirecting…</>
                    : submitting
                    ? <><Loader size={15} className="vs-spin" /> Launching…</>
                    : <><Store size={15} /> Launch my store</>
                  }
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorSetupPage;