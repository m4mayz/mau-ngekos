import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration - Storage only
const supabaseUrl = "https://uaxhnyyeagrokugdvjhm.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVheGhueXllYWdyb2t1Z2R2amhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODQzNjQsImV4cCI6MjA3Njg2MDM2NH0.2Fzn3mb5QA62Pcz1XtkIpxSiFOKVOKYwidq0b2OJk2s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Helper for uploading images to Supabase Storage
export const uploadImage = async (
    bucket: string,
    path: string,
    file: Blob | ArrayBuffer,
): Promise<string | null> => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
};

export const deleteImage = async (
    bucket: string,
    path: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error deleting image:", error);
        return false;
    }
};
