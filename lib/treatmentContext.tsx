"use client";

import React, { createContext, useContext, useState } from "react";
import { MedicationDetail, MEDICATIONS } from "./medications";

interface TreatmentContextType {
  selectedMedication: MedicationDetail | null;
  setSelectedMedication: (med: MedicationDetail | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const TreatmentContext = createContext<TreatmentContextType | undefined>(undefined);

export function TreatmentProvider({ children }: { children: React.ReactNode }) {
  const [selectedMedication, setSelectedMedication] = useState<MedicationDetail | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  return (
    <TreatmentContext.Provider
      value={{
        selectedMedication,
        setSelectedMedication,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce rounded-full border border-olive-700/20 bg-[#1A301F] px-5 py-2.5 text-xs font-medium text-white shadow-xl">
          {toastMessage}
        </div>
      )}
    </TreatmentContext.Provider>
  );
}

export function useTreatment() {
  const context = useContext(TreatmentContext);
  if (!context) {
    throw new Error("useTreatment must be used within TreatmentProvider");
  }
  return context;
}
