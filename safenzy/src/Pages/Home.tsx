import { Navbar } from "@/Components/Navbar";
import { FC } from "react";
import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/Components/Footer";
import HeroSection from "../assets/herosection.jpg";
import { useUser } from "@clerk/clerk-react";

export const Home: FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleWorkSpace = () => {
    navigate(`/workspace/${user?.id}`);
  };

  return (
    <>
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />

        <div className="relative mb-3">
          <img src={HeroSection} alt="Hero Section" className="w-full h-auto" />

          <Button
            onClick={handleWorkSpace}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
          >
            Workspace
          </Button>
        </div>
        <p className="font-extrabold text-xl mb-3">Safety before ride!</p>
        <p>
          Safenzy is your ultimate travel partner, ensuring your safety every
          step of the way during your ride. Safenzy prioritizes your security
          and peace of mind, making each journey safe, reliable, and worry-free.
        </p>
        <Footer />
      </div>
    </>
  );
};
