import React from 'react';

// Renders an <img> whose alpha channel is flattened onto a solid background color.
// Useful for PNG logos with transparency that need a consistent background.
// Props: src (required), alt, bg (CSS color, default '#ffffff'), className, style
const FlattenedImage = ({ src, alt = '', bg = '#ffffff', className = '', style = {} }) => {
  const [dataUrl, setDataUrl] = React.useState(null);

  React.useEffect(() => {
    if (!src) return;
    let mounted = true;
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.onload = () => {
      if (!mounted) return;
      try {
        const w = img.naturalWidth || img.width || 1;
        const h = img.naturalHeight || img.height || 1;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        // Fill background first, then draw the image to flatten alpha
        ctx.fillStyle = bg || '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const url = canvas.toDataURL('image/png');
        setDataUrl(url);
      } catch (e) {
        // Fallback to original src if anything goes wrong
        setDataUrl(src);
      }
    };
    img.onerror = () => {
      if (!mounted) return;
      setDataUrl(src);
    };
    img.src = src;
    return () => { mounted = false; };
  }, [src, bg]);

  // Until processed, show nothing to avoid flicker; could show original if desired
  if (!dataUrl) return null;
  return <img src={dataUrl} alt={alt} className={className} style={style} loading="lazy" />;
};

export default FlattenedImage;

