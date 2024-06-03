import HeroSection from "./practice/components/homepage/hero-section";
import HomepageBackground from "./practice/components/homepage/homepage-bg";
import HomepageNav from "./practice/components/homepage/homepage-nav";

export default async function HomePage() {
  return (
    <>
      <HomepageNav />
      <HomepageBackground />
      <HeroSection />
    </>
  );
}
