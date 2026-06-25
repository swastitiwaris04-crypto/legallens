'use client';
import PageTransition from '@/components/animations/PageTransition';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import DocumentTypes from '@/components/home/DocumentTypes';
import WhyLegalLens from '@/components/home/WhyLegalLens';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
      <HowItWorks />
      <FeaturesGrid />
      <DocumentTypes />
      <WhyLegalLens />
      <CTASection />
    </PageTransition>
  );
}
