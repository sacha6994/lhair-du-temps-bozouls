-- =============================================
-- L'Hair du Temps — Supabase Database Setup
-- =============================================
-- Exécutez ce SQL dans l'éditeur SQL de votre projet Supabase
-- (Dashboard > SQL Editor > New Query)

-- 1. Table des prestations
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  num text not null,
  title text not null,
  description text not null,
  price text not null,
  tags text[] default '{}',
  icon_name text default 'scissors',
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 2. Table des avis clients
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  text text not null,
  rating int default 5 check (rating >= 1 and rating <= 5),
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 3. Table des photos
create table if not exists photos (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  label text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 4. Activer RLS (Row Level Security)
alter table services enable row level security;
alter table testimonials enable row level security;
alter table photos enable row level security;

-- 5. Politiques de lecture publique (le site public peut lire)
create policy "Public read services" on services for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);
create policy "Public read photos" on photos for select using (true);

-- 6. Politiques d'écriture pour les utilisateurs authentifiés (admin)
create policy "Auth insert services" on services for insert to authenticated with check (true);
create policy "Auth update services" on services for update to authenticated using (true);
create policy "Auth delete services" on services for delete to authenticated using (true);

create policy "Auth insert testimonials" on testimonials for insert to authenticated with check (true);
create policy "Auth update testimonials" on testimonials for update to authenticated using (true);
create policy "Auth delete testimonials" on testimonials for delete to authenticated using (true);

create policy "Auth insert photos" on photos for insert to authenticated with check (true);
create policy "Auth update photos" on photos for update to authenticated using (true);
create policy "Auth delete photos" on photos for delete to authenticated using (true);

-- 7. Créer un bucket storage pour les photos
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict do nothing;

-- Politique storage : lecture publique
create policy "Public read photos storage" on storage.objects
  for select using (bucket_id = 'photos');

-- Politique storage : upload pour utilisateurs authentifiés
create policy "Auth upload photos storage" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos');

create policy "Auth delete photos storage" on storage.objects
  for delete to authenticated using (bucket_id = 'photos');

-- 8. Données initiales — Prestations
insert into services (num, title, description, price, tags, icon_name, featured, sort_order) values
  ('01', 'Coupe & Coiffage', 'Coupes sur-mesure, adaptées à votre morphologie et votre style de vie.', 'À partir de 35€', '{"Coupe femme","Coupe homme","Brushing"}', 'scissors', true, 1),
  ('02', 'Coloration', 'Techniques de pointe — balayage, ombré, couleur complète — avec des produits respectueux.', 'À partir de 55€', '{"Balayage","Mèches","Patine"}', 'brush', false, 2),
  ('03', 'Soins Capillaires', 'Rituels de soins profonds pour nourrir, réparer et sublimer votre chevelure.', 'À partir de 25€', '{"Kératine","Botox capillaire","Masque"}', 'sparkle', false, 3),
  ('04', 'Cérémonies', 'Coiffures événementielles pour mariages, galas et moments d''exception.', 'Sur devis', '{"Mariage","Chignon","Tresses"}', 'leaf', true, 4);

-- 9. Données initiales — Avis
insert into testimonials (name, text, rating, sort_order) values
  ('Camille L.', 'Un salon magnifique avec une ambiance incroyable. Le résultat est toujours au-delà de mes attentes. Je recommande les yeux fermés !', 5, 1),
  ('Sophie M.', 'La déco est sublime et l''accueil chaleureux. Mon balayage est exactement ce que je voulais. Merci pour ce moment de détente.', 5, 2),
  ('Juliette R.', 'Enfin un salon qui prend le temps d''écouter ! Les soins sont exceptionnels et l''espace est pensé dans les moindres détails.', 5, 3),
  ('Marie D.', 'Une expérience unique à chaque visite. L''équipe est aux petits soins et le cadre est absolument magnifique. Mon salon coup de cœur !', 5, 4),
  ('Laura B.', 'Le meilleur salon de la région, sans hésitation. Professionnalisme, écoute et résultat parfait. Je ne changerais pour rien au monde.', 5, 5);
