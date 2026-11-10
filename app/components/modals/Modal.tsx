"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel?: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShowModal(isOpen));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-800/70 p-2 backdrop-blur-lg md:p-4">
        <div className="relative my-auto flex max-h-[calc(100dvh-1rem)] w-full flex-col md:max-h-[calc(100dvh-2rem)] md:w-4/6 lg:w-3/6 xl:w-2/5">
          {/* Content */}
          <div
            className={`
            flex min-h-0 flex-col duration-300
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
            `}
          >
            <div className="flex min-h-0 max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none dark:bg-[#111318] md:max-h-[calc(100dvh-2rem)]">
              {/* Header */}
              <div className="relative flex shrink-0 items-center justify-center rounded-t border-b border-neutral-200 p-4 dark:border-[#24272f]">
                <button
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {/* Body */}
                <div className="relative p-6">{body}</div>
              </div>
              <div className="shrink-0 border-t border-neutral-200 bg-white dark:border-[#24272f] dark:bg-[#111318]">
                {/* Footer */}
                <div className="flex flex-col gap-2 p-4 md:p-6">
                  <div className="flex flex-row items-center gap-4 w-full">
                    {secondaryAction && secondaryActionLabel && (
                      <Button
                        outline
                        disabled={disabled}
                        label={secondaryActionLabel}
                        onClick={handleSecondaryAction}
                      />
                    )}
                    {actionLabel && (
                      <Button
                        disabled={disabled}
                        label={actionLabel}
                        onClick={handleSubmit}
                      />
                    )}
                  </div>
                  {footer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
