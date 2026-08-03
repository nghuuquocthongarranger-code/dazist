import { Nav } from "./components/Nav";
import { Hero } from "./components/sections/Hero";
import { PersonalInfo } from "./components/sections/PersonalInfo";
import { FourPillars } from "./components/sections/FourPillars";
import { Constitution } from "./components/sections/Constitution";
import { DayLookup } from "./components/sections/DayLookup";
import { ElementChart } from "./components/sections/ElementChart";
import { FamilyMarriage } from "./components/sections/FamilyMarriage";
import { HealthWealthCareer } from "./components/sections/HealthWealthCareer";
import { ThanSat } from "./components/sections/ThanSat";
import { DaiVan } from "./components/sections/DaiVan";
import { Summary, Footer } from "./components/sections/Summary";

function App() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <PersonalInfo />
        <FourPillars />
        <Constitution />
        <DayLookup />
        <ElementChart />
        <FamilyMarriage />
        <HealthWealthCareer />
        <ThanSat />
        <DaiVan />
        <Summary />
      </main>
      <Footer />
    </div>
  );
}

export default App;
