
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OcrResult {
  merchant?: string;
  amount?: string;
  category?: string;
  description?: string;
  currency?: string;
}

export function useReceiptOcr() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Call the OCR edge function with the receipt image URL
  async function scanReceipt(imageUrl: string): Promise<OcrResult | null> {
    setScanning(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke("ocr-receipt", {
      body: { image_url: imageUrl },
    });
    setScanning(false);
    if (error) {
      setError(error.message);
      return null;
    }
    return data as OcrResult;
  }

  return { scanReceipt, scanning, error };
}
