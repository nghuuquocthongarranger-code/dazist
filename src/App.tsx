import { BrowserRouter, Routes, Route } from "react-router";
import { Nav } from "./components/Nav";
import { CosmicBackground } from "./components/CosmicBackground";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { BaziPage } from "./pages/BaziPage";
import { WesternPage } from "./pages/WesternPage";
import { NumerologyPage } from "./pages/NumerologyPage";
import { TarotPage } from "./pages/TarotPage";
import { TarotLookupPage } from "./pages/TarotLookupPage";
import { TuViPage } from "./pages/TuViPage";
import { SynthesisPage } from "./pages/SynthesisPage";
import { PartnerPage } from "./pages/PartnerPage";
import { Footer } from "./components/sections/Summary";

function App() {
  return (
    <BrowserRouter>
      <div id="top">
        <CosmicBackground />
        <Nav />
        <ScrollToTop />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bat-tu" element={<BaziPage />} />
            <Route path="/chiem-tinh" element={<WesternPage />} />
            <Route path="/than-so-hoc" element={<NumerologyPage />} />
            <Route path="/tarot" element={<TarotPage />} />
            <Route path="/tarot/tra-soat" element={<TarotLookupPage />} />
            <Route path="/tu-vi" element={<TuViPage />} />
            <Route path="/tong-hop" element={<SynthesisPage />} />
            <Route path="/doi-tac" element={<PartnerPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
