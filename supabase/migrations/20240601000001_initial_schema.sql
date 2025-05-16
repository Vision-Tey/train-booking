-- Create tables for train routes and bookings
CREATE TABLE IF NOT EXISTS stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  train_number TEXT NOT NULL UNIQUE,
  name TEXT,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin_id UUID REFERENCES stations(id) NOT NULL,
  destination_id UUID REFERENCES stations(id) NOT NULL,
  train_id UUID REFERENCES trains(id) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(train_id, departure_time)
);

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID REFERENCES routes(id) NOT NULL,
  date DATE NOT NULL,
  seats_available INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(route_id, date)
);

CREATE TABLE IF NOT EXISTS seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  train_id UUID REFERENCES trains(id) NOT NULL,
  seat_number TEXT NOT NULL,
  coach TEXT NOT NULL,
  seat_type TEXT NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(train_id, coach, seat_number)
);

CREATE TABLE IF NOT EXISTS seat_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES schedules(id) NOT NULL,
  seat_id UUID REFERENCES seats(id) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(schedule_id, seat_id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  schedule_id UUID REFERENCES schedules(id) NOT NULL,
  booking_reference TEXT NOT NULL UNIQUE,
  passenger_count INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  seat_id UUID REFERENCES seats(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id, seat_id)
);

-- Create profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_seats ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can read all profiles but only update their own
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" 
ON profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Bookings: Users can view and manage their own bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
CREATE POLICY "Users can insert own bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
CREATE POLICY "Users can update own bookings" 
ON bookings FOR UPDATE 
USING (auth.uid() = user_id);

-- Booking seats: Users can view their own booking seats
DROP POLICY IF EXISTS "Users can view own booking seats" ON booking_seats;
CREATE POLICY "Users can view own booking seats" 
ON booking_seats FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_seats.booking_id 
    AND bookings.user_id = auth.uid()
  )
);

-- Admin policies for all tables
DROP POLICY IF EXISTS "Admins can do everything" ON profiles;
CREATE POLICY "Admins can do everything" 
ON profiles 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Enable realtime for relevant tables
alter publication supabase_realtime add table schedules;
alter publication supabase_realtime add table seat_availability;
alter publication supabase_realtime add table bookings;

-- Insert some initial stations
INSERT INTO stations (name, location) VALUES
('Kampala Central', 'Kampala'),
('Entebbe', 'Entebbe'),
('Jinja', 'Jinja'),
('Mbarara', 'Mbarara'),
('Gulu', 'Gulu'),
('Mbale', 'Mbale'),
('Kasese', 'Kasese'),
('Soroti', 'Soroti'),
('Arua', 'Arua'),
('Fort Portal', 'Fort Portal')
ON CONFLICT (name) DO NOTHING;
