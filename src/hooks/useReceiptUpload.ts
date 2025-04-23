
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useReceiptUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Returns: url on success, null on failure
  async function uploadReceipt(file: File): Promise<string | null> {
    if (!file) {
      setError("No file selected");
      toast.error("No file selected");
      return null;
    }

    setUploading(true);
    setError(null);
    
    try {
      // Make sure the receipts bucket exists - first check if it exists
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
      
      const receiptsBucketExists = buckets?.some(bucket => bucket.name === 'receipts');
      
      if (!receiptsBucketExists) {
        // Create the receipts bucket if it doesn't exist
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('receipts', { public: true });
        
        if (createBucketError) {
          throw new Error(`Failed to create receipts bucket: ${createBucketError.message}`);
        }
      }
      
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('receipts')
        .upload(filename, file, { upsert: false });
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('receipts')
        .getPublicUrl(filename);
      
      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file");
      }
      
      return urlData.publicUrl;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Upload failed: ${err.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { uploadReceipt, uploading, error };
}
