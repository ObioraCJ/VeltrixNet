import { useState } from "react";
import Hero from "../components/Hero";
import Packages from "../components/Packages";
import Contact from "../components/Contact";
import InterestModal from "../components/InterestModal";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Hero onExpressInterest={() => setModalOpen(true)} />
      <Packages />
      <Contact />
      <InterestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Home;