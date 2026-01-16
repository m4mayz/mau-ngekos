import { Database } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// TODO: Replace with your Supabase configuration
const supabaseUrl = "https://uaxhnyyeagrokugdvjhm.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVheGhueXllYWdyb2t1Z2R2amhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODQzNjQsImV4cCI6MjA3Njg2MDM2NH0.2Fzn3mb5QA62Pcz1XtkIpxSiFOKVOKYwidq0b2OJk2s";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
