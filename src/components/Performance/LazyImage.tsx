
import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMxNi42ODYzIDI4IDEzLjUwNTQgMjYuNjg0MyAxMS4yNTc2IDI0LjI0MjZDOS4wMDk3MSAyMS44MDA5IDggMTguNTA0MyA4IDE1QzggMTEuNDk1NyA5LjAwOTcxIDguMTk5MDkgMTEuMjU3NiA1Ljc1NzM2QzEzLjUwNTQgMy4zMTU2MyAxNi42ODYzIDIgMjAgMkMyMy4zMTM3IDIgMjYuNDk0NiAzLjMxNTYzIDI4Ljc0MjQgNS43NTczNkMzMC45OTAzIDguMTk5MDkgMzIgMTEuNDk1NyAzMiAxNUMzMiAxOC41MDQzIDMwLjk5MDMgMjEuODAwOSAyOC43NDI0IDI0LjI0MjZDMjYuNDk0NiAyNi42ODQzIDIzLjMxMzcgMjggMjAgMjhaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMCAyMkMxOC4zNDMxIDIyIDE3IDIwLjY1NjkgMTcgMTlDMTcgMTcuMzQzMSAxOC4zNDMxIDE2IDIwIDE2QzIxLjY1NjkgMTYgMjMgMTcuMzQzMSAyMyAxOUMyMyAyMC42NTY5IDIxLjY1NjkgMjIgMjAgMjJaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=',
  onLoad,
  loading = 'lazy',
  sizes,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <img
      ref={imgRef}
      src={isInView && !hasError ? src : placeholder}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-70'
      } ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading={loading}
      decoding="async"
      sizes={sizes}
    />
  );
};

export default LazyImage;
