"use client";

import { IconType } from "react-icons";

interface CategoryInputProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  icon: Icon,
  label,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 transition cursor-pointer
        ${selected
          ? "border-black bg-neutral-50 dark:border-rose-400 dark:bg-rose-500/10"
          : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-[#353943] dark:bg-[#17191f] dark:hover:border-[#697180]"}
        `}
    >
      <Icon size={30} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};
export default CategoryInput;
