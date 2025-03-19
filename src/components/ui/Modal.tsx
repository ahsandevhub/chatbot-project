// Modal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/20 z-50" />
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-h-screen h-[60vh] max-w-3xl bg-background p-6 rounded-xl shadow-lg z-50">
        {title && <DialogTitle className="hidden">{title}</DialogTitle>}
        {description && (
          <DialogDescription className="hidden">
            {description}
          </DialogDescription>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
