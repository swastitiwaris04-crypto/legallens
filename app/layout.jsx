import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'LegalLens — Understand any legal document. Instantly.',
  description: 'Upload your legal documents and get AI-powered explanations in plain language. Rent agreements, property papers, contracts, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh', paddingTop: 68 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
