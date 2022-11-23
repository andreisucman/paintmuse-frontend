import Hero from "../components/Hero";
import TextToImage from "../components/TextToImage/TextToImage";
import FloatingSearchBar from "../components/common/FloatingSearchBar";
import ToTopButton from "../components/common/ToTopButton";

export default function Home() {
  return (
    <>
      <Hero />
      <TextToImage />
      <ToTopButton />
    </>
  );
}
