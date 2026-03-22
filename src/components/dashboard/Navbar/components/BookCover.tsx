import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { fetchGoogleBooksCover } from '../../../../utils/coverFallback';

interface BookCoverProps {
  title:       string;
  author:      string;
  coverUrl:    string | null;   // from DB (Open Library)
  coverEmoji:  string | null;
  coverColor:  string | null;
  className?:  string;          // CSS class for the img element
  imgStyle?:   React.CSSProperties;
}

const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  coverUrl,
  coverEmoji,
  coverColor,
  className,
  imgStyle,
}) => {
  const [src,        setSrc]        = useState<string | null>(coverUrl);
  const [imgFailed,  setImgFailed]  = useState(false);
  const [googleUrl,  setGoogleUrl]  = useState<string | null>(null);
  const [googleTried,setGoogleTried]= useState(false);

  // If no Open Library URL, try Google Books immediately
  useEffect(() => {
    if (!coverUrl && !googleTried) {
      setGoogleTried(true);
      fetchGoogleBooksCover(title, author).then(url => {
        if (url) {
          setSrc(url);
          setGoogleUrl(url);
        }
      });
    }
  }, [coverUrl, title, author, googleTried]);

  const handleImgError = () => {
    if (!imgFailed && !googleUrl && !googleTried) {
      // Open Library URL failed — try Google Books
      setGoogleTried(true);
      fetchGoogleBooksCover(title, author).then(url => {
        if (url) {
          setSrc(url);
          setGoogleUrl(url);
        } else {
          setImgFailed(true);
          setSrc(null);
        }
      });
    } else {
      // Google Books also failed — show emoji fallback
      setImgFailed(true);
      setSrc(null);
    }
  };

  // Show real image
  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={title}
        className={className}
        style={imgStyle}
        onError={handleImgError}
      />
    );
  }

  // Emoji fallback
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: coverColor ?? '#1A1410',
      }}
    >
      {coverEmoji
        ? <span style={{ fontSize: '3.5rem' }}>{coverEmoji}</span>
        : <BookOpen size={28} color="#8A7968" />
      }
    </div>
  );
};

export default BookCover;