import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import ManualInput from "./ManuelInput";
import { useScan } from '../context/ScanContext';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { findProductByBarcode, mapItemToProduct } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanningFlowProps {
  onComplete: (points: number) => void;
  onBack: () => void;
  scanType: 'receipt' | 'product';
}

export function ScanningFlow({ onComplete, onBack, scanType }: ScanningFlowProps) {
  const {
    stage,
    earnedPoints,
    barcode,
    setStage,
    startScan,
    completeScan,
    setScanType,
    setBarcode,
    resetScan,
  } = useScan();
  const convex = useConvex();
  const navigate = useNavigate();
  const [scanError, setScanError] = useState<string | null>(null);
  const [lookupStatus, setLookupStatus] = useState<'idle' | 'loading' | 'not_found' | 'error'>('idle');
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  const resetLookupState = () => {
    setLookupStatus('idle');
    setLookupMessage(null);
  };

  useEffect(() => {
    setScanType(scanType);
    setStage('ready');
    setLookupStatus('idle');
    setLookupMessage(null);
    return () => resetScan();
  }, [scanType, setScanType, setStage, resetScan]);

  const lookupProduct = async (barcodeValue: string) => {
    setLookupStatus('loading');
    setLookupMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (barcodeValue === '00000000') {
        setLookupStatus('error');
        setLookupMessage('Unable to fetch product details. Please try again.');
        return;
      }

      const barcode = BigInt(barcodeValue);
      let product = null;

      try {
        const item = await convex.query(api.items.getItemByBarcode, { barcode });
        if (item) {
          product = mapItemToProduct(item);
        }
      } catch (error) {
        product = findProductByBarcode(barcodeValue);
        if (!product) {
          throw error;
        }
      }

      if (!product) {
        setLookupStatus('not_found');
        return;
      }

      navigate(`/product/${barcodeValue}`, { state: { product } });
    } catch (error) {
      setLookupStatus('error');
      setLookupMessage('Unable to fetch product details. Please try again.');
    }
  };

  const finishScan = (barcode: string) => {
    const points = scanType === 'receipt' ? Math.floor(Math.random() * 15) + 5 : 0;
    setBarcode(barcode);
    completeScan(points, barcode);

    if (scanType === 'product') {
      void lookupProduct(barcode);
    }
  };

  const handleManualBarcode = (barcode: string) => {
    setScanError(null);
    resetLookupState();
    finishScan(barcode);
  };

  const getScanErrorMessage = (error: unknown) => {
    const raw = error instanceof Error ? error.message : String(error ?? '');
    const normalized = raw.toLowerCase();

    if (
      normalized.includes('permission') ||
      normalized.includes('denied') ||
      normalized.includes('not authorized')
    ) {
      return 'Camera permission denied. Please enable camera access or enter the barcode manually.';
    }

    if (normalized.includes('cancel')) {
      return 'Scanning was cancelled. You can try again or enter the barcode manually.';
    }

    if (normalized.includes('not implemented') || normalized.includes('unavailable')) {
      return 'Scanner is unavailable on this device. Please enter the barcode manually.';
    }

    return 'Scanning failed. Please try again or enter the barcode manually.';
  };

  const handleScan = async () => {
    setScanError(null);
    resetLookupState();
    startScan(scanType);

    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
        scanInstructions: 'Hold the barcode within the frame',
        scanButton: true,
        scanText: 'Cancel',
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
      });

      if (!result?.ScanResult) {
        setStage('ready');
        setScanError('No barcode detected. Try again or enter it manually.');
        return;
      }

      finishScan(result.ScanResult);
    } catch (error) {
      setStage('ready');
      setScanError(getScanErrorMessage(error));
      console.error('Barcode scan failed:', error);
    }
  };

  const handleComplete = () => {
    if (scanType === 'receipt') {
      onComplete(earnedPoints);
      resetScan();
    } else {
      resetScan();
      onBack();
    }
  };

  const handleLookupRetry = () => {
    setScanError(null);
    resetLookupState();
    setStage('ready');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AnimatePresence mode="wait">
        {stage === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6"
          >
            <div className="w-full max-w-md">
              <div className="mb-6 flex flex-col items-center rounded-3xl bg-white px-6 py-8 shadow-md sm:px-8 sm:py-10">
                <div
                  className={`mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-3xl bg-gradient-to-br sm:h-48 sm:w-48 ${
                    scanType === 'receipt' ? 'from-green-100 to-green-200' : 'from-blue-100 to-blue-200'
                  }`}
                >
                  <Scan className={`h-20 w-20 sm:h-24 sm:w-24 ${scanType === 'receipt' ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
                <h2 className={`text-center text-xl sm:text-2xl ${scanType === 'receipt' ? 'text-green-700' : 'text-blue-700'} mb-3`}>
                  Klar til scanning
                </h2>
                <p className="text-center text-sm text-gray-600 sm:text-base">
                  {scanType === 'receipt'
                    ? 'Placer din kvittering foran kameraet. Vi analyserer automatisk dine sunde valg.'
                    : 'Placer produktets stregkode foran kameraet for at se hvor mange point det giver.'}
                </p>
              </div>

              <div className="flex flex-col items-center gap-y-6">
                <Button
                  onClick={handleScan}
                  className="h-12 w-full bg-green-600 text-white hover:bg-green-700 sm:w-80"
                >
                  <Scan className="h-5 w-5" />
                  Start scanning
                </Button>

                <ManualInput onSubmit={handleManualBarcode} />

                {scanError && (
                  <p className="max-w-sm text-center text-sm text-red-600">
                    {scanError}
                  </p>
                )}

                <Button
                  onClick={() => {
                    resetScan();
                    onBack();
                  }}
                  variant="ghost"
                  className="w-full text-black sm:w-80"
                >
                  Annuller
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6"
          >
            <div className="flex flex-col items-center gap-6 rounded-3xl bg-white px-6 py-8 shadow-md sm:px-8 sm:py-10">
              <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <div className="text-center">
                <h2 className="mb-2 text-gray-900">Scanner \u00e5bner</h2>
                <p className="text-gray-600">Hold stregkoden foran kameraet.</p>
              </div>
              <Button
                onClick={() => {
                  resetScan();
                  onBack();
                }}
                variant="ghost"
                className="w-full text-black sm:w-60"
              >
                Annuller
              </Button>
            </div>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-50"
          >
            <div className="mx-auto min-h-screen max-w-lg bg-white">
              {scanType === 'receipt' ? (
                <div className="px-4 py-8 sm:px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="relative"
                  >
                    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-2xl sm:p-8">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                          className="absolute"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + (i % 2) * 70}%`,
                          }}
                        >
                          <Sparkles className="h-6 w-6 text-yellow-300" />
                        </motion.div>
                      ))}

                      <div className="relative z-10">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 sm:h-20 sm:w-20">
                          <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12" />
                        </div>
                        <h2 className="mb-2 text-center text-white">
                          Tillykke!
                        </h2>
                        <p className="mb-6 text-center text-white/90">
                          Du har optjent
                        </p>
                        <div className="text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="mb-2 text-4xl sm:text-5xl"
                          >
                            {earnedPoints} Point
                          </motion.div>
                          <p className="text-white/90">i sundhedspoint!</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="mb-4 rounded-2xl bg-white p-6 shadow-lg">
                    <h3 className="mb-3 text-green-700">Dine sunde valg:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between border-b py-2">
                        <span className="text-gray-700">🥗 Gr\u00f8ntsager</span>
                        <span className="text-green-600">+{Math.floor(earnedPoints * 0.4)} Point</span>
                      </div>
                      <div className="flex items-center justify-between border-b py-2">
                        <span className="text-gray-700">🍎 Frugt</span>
                        <span className="text-green-600">+{Math.floor(earnedPoints * 0.35)} Point</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-700">🥛 Mejeriprodukter</span>
                        <span className="text-green-600">+{earnedPoints - Math.floor(earnedPoints * 0.4) - Math.floor(earnedPoints * 0.35)} Point</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleComplete}
                    className="h-12 w-full bg-green-600 hover:bg-green-700 sm:h-14"
                  >
                    Forts\u00e6t
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 px-4 py-10 text-center sm:px-6">
                  {lookupStatus === 'loading' && (
                    <>
                      <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                      <div>
                        <h2 className="mb-2 text-gray-900">Looking up product</h2>
                        <p className="text-gray-600">Checking barcode {barcode ?? ''}.</p>
                      </div>
                    </>
                  )}
                  {lookupStatus === 'not_found' && (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl font-semibold text-yellow-700">
                        ?
                      </div>
                      <div>
                        <h2 className="mb-2 text-gray-900">Product not found</h2>
                        <p className="text-gray-600">
                          We could not find a product for this barcode. Try again or enter it manually.
                        </p>
                      </div>
                      <div className="flex w-full flex-col gap-3 sm:flex-row">
                        <Button onClick={handleLookupRetry} className="h-12 w-full sm:flex-1">
                          Try again
                        </Button>
                        <Button onClick={onBack} variant="ghost" className="h-12 w-full sm:flex-1">
                          Back
                        </Button>
                      </div>
                    </>
                  )}
                  {lookupStatus === 'error' && (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl font-semibold text-red-700">
                        !
                      </div>
                      <div>
                        <h2 className="mb-2 text-gray-900">Lookup failed</h2>
                        <p className="text-gray-600">
                          {lookupMessage ?? 'Unable to fetch product details. Please try again.'}
                        </p>
                      </div>
                      <div className="flex w-full flex-col gap-3 sm:flex-row">
                        <Button onClick={handleLookupRetry} className="h-12 w-full sm:flex-1">
                          Try again
                        </Button>
                        <Button onClick={onBack} variant="ghost" className="h-12 w-full sm:flex-1">
                          Back
                        </Button>
                      </div>
                    </>
                  )}
                  {lookupStatus === 'idle' && (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-700">
                        ...
                      </div>
                      <p className="text-gray-600">Preparing lookup...</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
