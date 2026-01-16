export type UserRole = "seeker" | "owner" | "admin";
export type HouseStatus = "pending" | "approved" | "rejected";

export interface User {
    id: string;
    firebase_uid: string;
    email: string;
    full_name: string;
    role: UserRole;
    phone_number: string | null;
    created_at: string;
}

export interface BoardingHouse {
    id: string;
    owner_id: string;
    name: string;
    description: string | null;
    price_per_month: number;
    latitude: number;
    longitude: number;
    address: string;
    whatsapp_number: string;
    status: HouseStatus;
    created_at: string;
    // Joined data
    owner?: User;
    images?: HouseImage[];
}

export interface HouseImage {
    id: string;
    house_id: string;
    image_url: string;
    created_at: string;
}

// Supabase Database type for type-safe queries
export interface Database {
    public: {
        Tables: {
            users: {
                Row: User;
                Insert: Omit<User, "id" | "created_at">;
                Update: Partial<Omit<User, "id" | "created_at">>;
            };
            boarding_houses: {
                Row: BoardingHouse;
                Insert: Omit<
                    BoardingHouse,
                    "id" | "created_at" | "owner" | "images"
                >;
                Update: Partial<
                    Omit<
                        BoardingHouse,
                        "id" | "created_at" | "owner" | "images"
                    >
                >;
            };
            house_images: {
                Row: HouseImage;
                Insert: Omit<HouseImage, "id" | "created_at">;
                Update: Partial<Omit<HouseImage, "id" | "created_at">>;
            };
        };
        Enums: {
            user_role: UserRole;
            house_status: HouseStatus;
        };
    };
}
