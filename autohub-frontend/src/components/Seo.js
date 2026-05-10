import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE = 'AutoHub';

export default function Seo({ title, description, image, type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} — ${SITE}` : SITE;
  const url = typeof window !== 'undefined' ? window.location.href : '';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      {url && <link rel="canonical" href={url} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
