import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
        <p className="font-bold text-lg mb-6">챌린지에 참여하시겠습니까?</p>
        <div className="flex justify-between gap-4">
          <button
            className="flex-1 py-3 border border-[#FF6A00] rounded-xl font-bold"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="flex-1 py-3 bg-[#FF6A00] text-white rounded-xl font-bold"
            onClick={onConfirm}
          >
            결제
          </button>
        </div>
      </div>
    </div>
  );
};
