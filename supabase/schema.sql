-- Santhigiri College Press — Supabase schema
-- Run this in the Supabase SQL editor when moving to production

create type user_role as enum ('customer', 'admin');
create type order_status as enum (
  'pending', 'confirmed', 'printing', 'ready',
  'out_for_delivery', 'completed', 'cancelled'
);
create type payment_method as enum ('online', 'counter');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type fulfillment_type as enum ('pickup', 'delivery');
create type color_option as enum ('bw', 'color');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  student_id text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  sort_order int default 0
);

create table paper_types (
  id text primary key,
  name text not null,
  description text
);

create table paper_sizes (
  id text primary key,
  name text not null,
  width_mm int not null,
  height_mm int not null
);

create table products (
  id text primary key,
  category_id text not null references categories(id),
  name text not null,
  description text,
  base_price numeric not null default 0,
  min_quantity int not null default 1,
  supports_color boolean not null default false,
  requires_quote boolean not null default false,
  turnaround_hours int not null default 24,
  active boolean not null default true
);

create table pricing_rules (
  id text primary key,
  product_id text not null references products(id),
  paper_type_id text not null references paper_types(id),
  paper_size_id text not null references paper_sizes(id),
  color_option color_option not null,
  price_per_unit numeric not null,
  min_quantity int not null default 1
);

create table pickup_locations (
  id text primary key,
  name text not null,
  description text,
  hours text
);

create table delivery_zones (
  id text primary key,
  name text not null,
  pincodes text[] not null,
  charge numeric not null default 0
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references profiles(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_student_id text,
  subtotal numeric not null,
  delivery_charge numeric not null default 0,
  total numeric not null,
  status order_status not null default 'pending',
  payment_method payment_method not null,
  payment_status payment_status not null default 'pending',
  fulfillment_type fulfillment_type not null,
  pickup_location_id text references pickup_locations(id),
  delivery_address text,
  delivery_pincode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  product_name text not null,
  quantity int not null,
  paper_type_id text not null,
  paper_type_name text not null,
  paper_size_id text not null,
  paper_size_name text not null,
  color_option color_option not null,
  unit_price numeric not null,
  total_price numeric not null,
  notes text
);

create table order_files (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size bigint not null,
  file_type text not null
);

-- Row Level Security
alter table profiles enable row level security;
alter table orders enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on orders for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
