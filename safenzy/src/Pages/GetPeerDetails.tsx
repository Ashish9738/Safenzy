import { FC, useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Navbar } from "@/Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export const GetPeerDetails: FC = () => {
  const { user } = useUser();
  const userId = user?.id;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data:", formData);
    navigate(`/workspace/${userId}`);
  };

  return (
    <div className="px-6 md:px-[200px] flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md w-full space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
