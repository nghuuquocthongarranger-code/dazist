import { BaziHero } from "../components/sections/BaziHero";
import { BaziTable } from "../components/sections/BaziTable";
import { BaziHub } from "../components/sections/BaziHub";

export function BaziPage() {
  return (
    <>
      <BaziHero />
      <BaziTable />
      <BaziHub />
    </>
  );
}