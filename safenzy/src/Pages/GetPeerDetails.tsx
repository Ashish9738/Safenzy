import { FC, useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";

export const GetPeerDetails: FC = () => {
  const [formData, setFormData] = useState({
    username: "",
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
    // You can handle the form submission logic here
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-4">
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
      </form>
    </Card>
  );
};
