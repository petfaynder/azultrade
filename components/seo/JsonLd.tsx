import React from 'react';

interface JsonLdProps {
  data?: any;
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.azultrade.com",
    "name": "Azul Global Trade",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.azultrade.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.azultrade.com"
    }
  };

  const structuredData = data || defaultStructuredData;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default JsonLd;
