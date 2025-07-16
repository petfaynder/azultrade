export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Azul Global Trade",
    description: "Leading exporter of premium Turkish agricultural machinery worldwide",
    url: "https://azulglobaltrade.com",
    logo: "https://azulglobaltrade.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-XXX-XXX-XXXX",
      contactType: "customer service",
      availableLanguage: ["English", "Turkish"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
      addressLocality: "Istanbul",
    },
    sameAs: [
      "https://linkedin.com/company/azul-global-trade",
      "https://facebook.com/azulglobaltrade",
      "https://instagram.com/azulglobaltrade",
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Azul Global Trade",
    url: "https://azulglobaltrade.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://azulglobaltrade.com/products?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ExportCompany",
    name: "Azul Global Trade",
    description: "Premium Turkish agricultural machinery export company",
    url: "https://azulglobaltrade.com",
    telephone: "+90-XXX-XXX-XXXX",
    email: "info@azulglobaltrade.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
      addressLocality: "Istanbul",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.0082",
      longitude: "28.9784",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$$$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
    </>
  )
}
