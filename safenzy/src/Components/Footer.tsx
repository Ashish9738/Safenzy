import { FC } from "react";
import { Link } from "react-router-dom";

export const Footer: FC = () => {
  return (
    <>
      <div className="border border-gray-100 my-9"></div>
      <div className="bg-black h-18">
        <Link to="/">
          <h1 className="py-5 pl-5 text-xl font-bold cursor-pointer text-white">
            &copy; Safenzy
          </h1>
        </Link>
      </div>
    </>
  );
};
