import { Navbar } from "@/Components/Navbar";
import { FC } from "react";

export const Home: FC = () => {
  return (
    <>
      <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
        <Navbar />
      </div>
    </>
  );
};
