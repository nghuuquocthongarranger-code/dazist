import { useState } from "react";
import { TarotHero } from "../components/sections/TarotHero";
import { TarotModal } from "../components/tarot/TarotModal";

export function TarotPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <TarotHero onOpen={() => setModalOpen(true)} />
      {modalOpen && <TarotModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
