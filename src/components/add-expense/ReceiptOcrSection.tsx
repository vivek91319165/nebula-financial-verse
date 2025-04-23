
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReceiptUpload } from "@/hooks/useReceiptUpload";
import { useReceiptOcr } from "@/hooks/useReceiptOcr";
import { toast } from "sonner";

interface OcrResult {
  merchant?: string;
  amount?: string;
  category?: string;
  description?: string;
  currency?: string;
}

export interface ReceiptOcrSectionProps {
  onOcrFill: (ocrData: OcrResult) => void;
}

const ReceiptOcrSection = ({ onOcrFill }: ReceiptOcrSectionProps) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const { uploadReceipt, uploading } = useReceiptUpload();
  const { scanReceipt, scanning: ocrScanning } = useReceiptOcr();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    const url = await uploadReceipt(file);
    if (url) {
      setReceiptUrl(url);
      toast.success("Receipt uploaded!");
    } else {
      toast.error("Failed to upload receipt");
    }
  };

  const handleOcrAndFill = async () => {
    if (!receiptUrl) {
      toast.error("Upload a receipt image first.");
      return;
    }
    toast.info("Scanning receipt with AI...");
    const ocrData = await scanReceipt(receiptUrl);
    if (ocrData) {
      onOcrFill(ocrData);
      toast.success("Receipt details extracted!");
    } else {
      toast.error("Could not extract details from receipt.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-nebula-blue/10 border border-nebula-blue/20 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer nebula-glow ${ocrScanning ? "opacity-60 pointer-events-none" : ""}`}
        onClick={handleOcrAndFill}
      >
        <div className="bg-nebula-blue/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          {ocrScanning ? (
            <div className="w-6 h-6 border-2 border-nebula-blue border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="text-nebula-blue h-6 w-6" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-nebula-blue mb-1">
          {ocrScanning ? "Processing..." : "Scan Receipt"}
        </h3>
        <p className="text-sm text-center text-gray-400">
          {ocrScanning
            ? "Analyzing image and extracting details with AI..."
            : "Use AI to read your receipt and auto-fill details"}
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-nebula-blue/10 border border-nebula-blue/20 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer nebula-glow ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <label
          htmlFor="receipt-upload"
          className="w-full flex flex-col items-center cursor-pointer"
        >
          <div className="bg-nebula-blue/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Upload className="text-nebula-blue h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-nebula-blue mb-1">Upload Receipt</h3>
          <p className="text-sm text-center text-gray-400">
            {receiptFile
              ? `Uploaded: ${receiptFile.name}`
              : uploading
              ? "Uploading..."
              : "Upload an image of your receipt (.jpg, .png)"
            }
          </p>
          <input
            id="receipt-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
      </motion.div>
    </div>
  );
};

export default ReceiptOcrSection;
