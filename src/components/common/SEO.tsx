import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = "SARDIN-AI - Sistema Autónomo de Navegación Marítima",
  description = "Plataforma avanzada de navegación marítima con inteligencia artificial para pesca comercial. Optimización de rutas, predicción de zonas de pesca y monitoreo en tiempo real.",
  keywords = "navegación marítima, pesca comercial, inteligencia artificial, GPS marino, sistema autónomo, predicción pesca, optimización rutas",
  image = "/maritime-dashboard-preview.jpg",
  url = "https://sardin-ai.com"
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="author" content="SARDIN-AI Team" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1e40af" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SARDIN-AI" />
      <meta property="og:locale" content="es_ES" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "SARDIN-AI",
          "description": description,
          "url": url,
          "applicationCategory": "NavigationApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "creator": {
            "@type": "Organization",
            "name": "SARDIN-AI Team"
          }
        })}
      </script>
    </Helmet>
  );
}