import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { lookupFoodByBarcode } from '../utils/api';

/**
 * Barcode Scanner Component
 * Uses html5-qrcode to scan barcodes via device camera
 * Looks up nutrition data from Open Food Facts
 */
export default function BarcodeScanner({ onFoodFound, onClose }) {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState(null);

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
              // Common barcode formats
              0,  // QR_CODE
              5,  // EAN_13 (most common on products)
              6,  // EAN_8
              7,  // UPC_A
              8,  // UPC_E
              9,  // CODE_39
              10, // CODE_93
              11, // CODE_128
              12, // ITF
              13, // CODABAR
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
    if (decodedText === lastScannedCode) {
      return;
    }

    setLastScannedCode(decodedText);
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
        setLastScannedCode(null);

        // Resume scanning
        if (scannerRef.current) {
          await scannerRef.current.resume();
        }
      }
    } catch (err) {
      console.error('Error looking up barcode:', err);
      setError(err.message || 'Failed to look up product. Please try again.');
      setLastScannedCode(null);

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
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Scan Barcode
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Point your camera at a product barcode. The scanner will automatically detect and look up nutrition information.
          </p>
        </div>

        {/* Camera Preview */}
        <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
          <div id="barcode-reader" className="w-full min-h-[400px]"></div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-white font-medium">Looking up product...</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Status Info */}
        {isScanning && !error && !isLoading && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              Camera active - Ready to scan
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Close Scanner
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Supported formats: UPC-A, EAN-13, EAN-8, Code 128, and more</p>
          <p className="mt-1">Works best with clear, well-lit barcodes</p>
        </div>
      </div>
    </div>
  );
}
