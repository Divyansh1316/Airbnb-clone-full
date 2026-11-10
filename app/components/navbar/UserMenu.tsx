"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";
import ThemeSelector from "@/app/components/ThemeSelector";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-[#24272e] dark:text-neutral-100 dark:hover:bg-[#2d3038] transition cursor-pointer"
        >
          Airbnb your home
        </div>
        <button
          onClick={toggleOpen}
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label="Open profile menu"
          className="flex cursor-pointer flex-row items-center gap-3 rounded-full border-[1px] border-neutral-200 p-3 transition hover:shadow-md sm:p-4 md:px-2 md:py-1"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white text-sm shadow-xl dark:border-[#2b2e36] dark:bg-[#111318]">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/trips");
                  }}
                  label="My trips"
                />
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/favorites");
                  }}
                  label="My favorites"
                />
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/wishlists");
                  }}
                  label="My wishlists"
                />
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/reservations");
                  }}
                  label="My reservations"
                />
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/properties");
                  }}
                  label="My properties"
                />
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    rentModal.onOpen();
                  }}
                  label="Airbnb my home"
                />
                <hr />
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    void signOut();
                  }}
                  label="Logout"
                />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    loginModal.onOpen();
                  }}
                  label="Login"
                />
                <MenuItem
                  onClick={() => {
                    setIsOpen(false);
                    registerModal.onOpen();
                  }}
                  label="Sign up"
                />
              </>
            )}
            <div className="border-t border-neutral-200 px-4 py-3 dark:border-[#2b2e36]">
              <ThemeSelector />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserMenu;
