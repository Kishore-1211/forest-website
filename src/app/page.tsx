import { LoadingScreen } from "@/sections/LoadingScreen";
import { HeroForest } from "@/sections/HeroForest";
import { Story } from "@/sections/Story";
import { SquirrelScene } from "@/sections/SquirrelScene";
import { MagicalForest } from "@/sections/MagicalForest";
import { FinalCTA } from "@/sections/FinalCTA";
import { Footer } from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main id="main-content">
        <HeroForest />
        <Story />
        <SquirrelScene />
        <MagicalForest />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
