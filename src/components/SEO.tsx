import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title = "Rehan Mulla | Creative Developer & Problem Solver",
  description = "19-year-old creative developer passionate about building meaningful tech solutions. Specializing in web development, Python, and UI/UX design.",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  url = "https://rehanmulla.dev"
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="author" content="Rehan Mulla" />
      <meta name="keywords" content="web developer, creative developer, UI/UX designer, Python developer, full-stack developer, portfolio" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}
