
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useReceiptUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Returns: url on success, null on failure
  async function uploadReceipt(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);
    const filename = `${Date.now()}-${file.name}`;
    const { data, error: uploadError } = await supabase
      .storage
      .from('receipts')
      .upload(filename, file, { upsert: false });
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return null;
    }
    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('receipts')
      .getPublicUrl(filename);
    setUploading(false);
    return urlData?.publicUrl || null;
  }

  return { uploadReceipt, uploading, error };
}
