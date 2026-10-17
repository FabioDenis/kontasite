import { SiteHeader } from "@/features/landing/components/site-header";
import { Hero } from "@/features/landing/sections/hero";
import { Steps } from "@/features/landing/sections/steps";
import { Features } from "@/features/landing/sections/features";
import { BeforeAfter } from "@/features/landing/sections/before-after";
import { BusinessTypes } from "@/features/landing/sections/business-types";
import { Benefits } from "@/features/landing/sections/benefits";
import { AllIncluded } from "@/features/landing/sections/all-included";
import { Faq } from "@/features/landing/sections/faq";
import { FinalCta } from "@/features/landing/sections/final-cta";
import { SiteFooter } from "@/features/landing/sections/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Steps />
        <Features />
        <BeforeAfter />
        <BusinessTypes />
        <Benefits />
        <AllIncluded />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
