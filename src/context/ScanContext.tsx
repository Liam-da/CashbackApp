import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ScanType = 'receipt' | 'product';
export type ScanStage = 'ready' | 'scanning' | 'success';

interface ScanState {
  type: ScanType | null;
  stage: ScanStage;
  earnedPoints: number;
  barcode: string | null;
}

interface ScanContextType extends ScanState {
  setScanType: (type: ScanType) => void;
  setStage: (stage: ScanStage) => void;
  startScan: (type: ScanType) => void;
  completeScan: (points: number, barcode?: string) => void;
  setBarcode: (barcode: string) => void;
  resetScan: () => void;
}

const initialState: ScanState = {
  type: null,
  stage: 'ready',
  earnedPoints: 0,
  barcode: null,
};

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ScanState>(initialState);

  const setScanType = useCallback((type: ScanType) => {
    setState((prev) => ({ ...prev, type }));
  }, []);

  const setStage = useCallback((stage: ScanStage) => {
    setState((prev) => ({ ...prev, stage }));
  }, []);

  const startScan = useCallback((type: ScanType) => {
    setState({ type, stage: 'scanning', earnedPoints: 0, barcode: null });
  }, []);

  const completeScan = useCallback((points: number, barcode?: string) => {
    setState((prev) => ({
      ...prev,
      stage: 'success',
      earnedPoints: points,
      barcode: barcode ?? prev.barcode,
    }));
  }, []);

  const setBarcode = useCallback((barcode: string) => {
    setState((prev) => ({ ...prev, barcode }));
  }, []);

  const resetScan = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setScanType,
      setStage,
      startScan,
      completeScan,
      setBarcode,
      resetScan,
    }),
    [state, setScanType, setStage, startScan, completeScan, setBarcode, resetScan]
  );

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within ScanProvider');
  }
  return context;
}
