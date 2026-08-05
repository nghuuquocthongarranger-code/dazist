import { useState } from "react";
import { WesternHero } from "../components/sections/WesternHero";
import { WesternTopicModal } from "../components/sections/WesternHub";

export function WesternPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      <WesternHero onSelectTopic={setOpenKey} hideLabels={openKey !== null} />
      <WesternTopicModal openKey={openKey} onClose={() => setOpenKey(null)} />
    </>
  );
}
