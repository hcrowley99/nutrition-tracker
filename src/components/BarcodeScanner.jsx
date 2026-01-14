import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { lookupFoodByBarcode } from '../utils/api';

/**
 * Barcode Scanner Component
 * Uses html5-qrcode to scan barcodes via device camera
 * Looks up nutrition data from Open Food Facts
 */
export default function BarcodeScanner({ onFoodFound, onClose }) {
  const scannerRef = useRef(null);
  const lastScannedCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let html5QrCode = null;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode('barcode-reader');
        scannerRef.current = html5QrCode;

        // Get available cameras
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          // Use back camera if available (better for barcode scanning)
          const backCamera = devices.find(device =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear')
          ) || devices[0];

          // Configure scanner for barcode detection
          const config = {
            fps: 10, // Frames per second to scan
            qrbox: { width: 250, height: 150 }, // Scanning area (wider for barcodes)
            aspectRatio: 1.777778, // 16:9 aspect ratio
            formatsToSupport: [
              // Common barcode formats (using proper enum values)
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.EAN_13,      // Most common on products
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.CODE_93,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.ITF,
              Html5QrcodeSupportedFormats.CODABAR,
            ]
          };

          await html5QrCode.start(
            backCamera.id,
            config,
            onScanSuccess,
            onScanFailure
          );

          setIsScanning(true);
          setError(null);
        } else {
          setError('No cameras found on this device.');
        }
      } catch (err) {
        console.error('Error starting scanner:', err);
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access and try again.');
        } else {
          setError('Failed to start camera. Please check your permissions and try again.');
        }
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  /**
   * Called when a barcode is successfully scanned
   */
  const onScanSuccess = async (decodedText, decodedResult) => {
    // Prevent duplicate scans of the same code
    if (decodedText === lastScannedCodeRef.current) {
      return;
    }

    lastScannedCodeRef.current = decodedText;
    setIsLoading(true);
    setError(null);

    try {
      // Stop scanning while we look up the product
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.pause(true);
      }

      // Look up the barcode in Open Food Facts
      const food = await lookupFoodByBarcode(decodedText);

      if (food) {
        // Success - pass food data back to parent
        onFoodFound(food);
      } else {
        // Product not found
        setError(`Barcode ${decodedText} not found in database. Try manual search.`);
        lastScannedCodeRef.current = null;

        // Resume scanning
        if (scannerRef.current) {
          await scannerRef.current.resume();
        }
      }
    } catch (err) {
      console.error('Error looking up barcode:', err);
      setError(err.message || 'Failed to look up product. Please try again.');
      lastScannedCodeRef.current = null;

      // Resume scanning
      if (scannerRef.current) {
        await scannerRef.current.resume();
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Called when scanning fails (not an error, just no barcode detected)
   */
  const onScanFailure = (error) => {
    // Don't show errors for normal scanning failures (no barcode in frame)
    // Only log to console for debugging
    // console.log('Scan attempt:', error);
  };

  /**
   * Handle close button
   */
  const handleClose = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-700 animate-scale-in">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-bold text-white">
            📷 Scan Barcode
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-400 hover:bg-gray-700 rounded-xl transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-5 p-4 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-2xl border-2 border-blue-700">
          <p className="text-sm text-blue-300 font-medium">
            💡 Point your camera at a product barcode. The scanner will automatically detect and look up nutrition information.
          </p>
        </div>

        {/* Camera Preview */}
        <div className="relative mb-5 bg-black rounded-2xl overflow-hidden border-2 border-gray-600 shadow-lg">
          <div id="barcode-reader" className="w-full min-h-[400px]"></div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center bg-gray-800/10 backdrop-blur-md rounded-2xl p-6">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto mb-3"></div>
                <p className="text-white font-semibold text-lg">Looking up product...</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-4 bg-gradient-to-br from-red-900/40 to-pink-900/40 border-2 border-red-700 rounded-2xl">
            <p className="text-red-300 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Status Info */}
        {isScanning && !error && !isLoading && (
          <div className="mb-5 p-4 bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-700 rounded-2xl">
            <p className="text-sm text-green-300 text-center font-semibold">
              ✅ Camera active - Ready to scan
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleClose}
            className="px-8 py-3.5 bg-gray-800 border-2 border-gray-600 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            Close Scanner
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-5 text-center text-xs text-gray-500 bg-gray-700 rounded-xl p-3">
          <p className="font-medium">📱 Supported formats: UPC-A, EAN-13, EAN-8, Code 128, and more</p>
          <p className="mt-1">Works best with clear, well-lit barcodes</p>
        </div>
      </div>
    </div>
  );
}
