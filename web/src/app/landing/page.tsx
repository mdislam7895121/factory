import CapabilitiesGrid from '@/components/landing/CapabilitiesGrid';
import ComparisonSection from '@/components/landing/ComparisonSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Hero from '@/components/landing/Hero';
import ProofPanel from '@/components/landing/ProofPanel';
import SerialPipeline from '@/components/landing/SerialPipeline';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B1220]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-12 md:px-8 lg:py-16">
        <Hero />
        <SerialPipeline />
        <CapabilitiesGrid />
        <ComparisonSection />
        <ProofPanel />
        <FinalCTA />
      </div>
    </main>
  );
}
