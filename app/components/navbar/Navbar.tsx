"use client";

import Container from "../Container";
import Categories from "./Categories";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/app/types";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="border-b border-neutral-200 py-3 dark:border-[#363941] sm:py-4">
        <Container>
          <div className="flex flex-grow items-center justify-between gap-2 sm:gap-3 md:gap-0">
            <Logo />
            <div className="hidden md:block">
              <Search />
            </div>
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
