import { Hero } from "../components/sections/Hero";
import { HomeShortcuts } from "../components/sections/HomeShortcuts";
import { DayLookup } from "../components/sections/DayLookup";

export function HomePage() {
  return (
    <>
      <Hero />
      <HomeShortcuts />
      <DayLookup />
    </>
  );
}
