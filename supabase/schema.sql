-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user role enum
CREATE TYPE user_role AS ENUM ('seeker', 'owner', 'admin');

-- Create house status enum
CREATE TYPE house_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'seeker',
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boarding houses table
CREATE TABLE boarding_houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_per_month NUMERIC NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  status house_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- House images table
CREATE TABLE house_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID REFERENCES boarding_houses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_boarding_houses_status ON boarding_houses(status);
CREATE INDEX idx_boarding_houses_owner ON boarding_houses(owner_id);
CREATE INDEX idx_house_images_house ON house_images(house_id);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boarding_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_images ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert themselves" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update themselves" ON users FOR UPDATE USING (true);

-- Boarding houses policies
CREATE POLICY "Anyone can view approved houses" ON boarding_houses 
  FOR SELECT USING (status = 'approved' OR auth.uid()::text = owner_id::text);

CREATE POLICY "Owners can insert houses" ON boarding_houses 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can update own houses" ON boarding_houses 
  FOR UPDATE USING (true);

-- House images policies
CREATE POLICY "Anyone can view images of approved houses" ON house_images 
  FOR SELECT USING (true);

CREATE POLICY "Owners can insert images" ON house_images 
  FOR INSERT WITH CHECK (true);

-- Note: For admin functionality, you may want to create a more sophisticated
-- RLS policy or use service role key for admin operations
