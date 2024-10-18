import { Navbar } from "@/Components/Navbar";
import { FC } from "react";
import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";
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
        <Button onClick={handleWorkSpace}>Workspace</Button>
      </div>
    </>
  );
};
