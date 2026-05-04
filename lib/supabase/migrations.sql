-- ============================================
-- DUNLY - Migrations Supabase
-- Exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles (extension de auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  prenom TEXT,
  nom TEXT,
  entreprise TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'cabinet')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  logiciel_facturation TEXT,
  factures_par_mois INTEGER,
  delai_paiement_actuel TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour créer le profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, prenom, nom, entreprise)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'prenom',
    NEW.raw_user_meta_data->>'nom',
    NEW.raw_user_meta_data->>'entreprise'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- TABLE: clients
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  score TEXT DEFAULT 'bon' CHECK (score IN ('bon', 'moyen', 'risque')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: factures
-- ============================================
CREATE TABLE IF NOT EXISTS factures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  numero TEXT NOT NULL,
  montant NUMERIC(10,2) NOT NULL CHECK (montant > 0),
  date_emission DATE,
  date_echeance DATE,
  statut TEXT DEFAULT 'en-attente' CHECK (statut IN ('en-attente', 'relancee', 'payee', 'litige')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: relances
-- ============================================
CREATE TABLE IF NOT EXISTS relances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  facture_id UUID REFERENCES factures(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('douce', 'ferme', 'urgente', 'manuelle')),
  statut TEXT DEFAULT 'programmee' CHECK (statut IN ('programmee', 'envoyee', 'ouverte', 'cliquee')),
  envoye_le TIMESTAMPTZ,
  contenu_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE relances ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies pour clients
CREATE POLICY "Users can manage own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

-- Policies pour factures
CREATE POLICY "Users can manage own factures" ON factures
  FOR ALL USING (auth.uid() = user_id);

-- Policies pour relances
CREATE POLICY "Users can manage own relances" ON relances
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Calculer le score client automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION calculate_client_score()
RETURNS TRIGGER AS $$
DECLARE
  retards_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE statut IN ('en-attente', 'relancee') AND date_echeance < NOW()),
    COUNT(*)
  INTO retards_count, total_count
  FROM factures
  WHERE client_id = COALESCE(NEW.client_id, OLD.client_id);

  IF total_count > 0 THEN
    IF retards_count = 0 THEN
      UPDATE clients SET score = 'bon' WHERE id = COALESCE(NEW.client_id, OLD.client_id);
    ELSIF retards_count::FLOAT / total_count < 0.3 THEN
      UPDATE clients SET score = 'moyen' WHERE id = COALESCE(NEW.client_id, OLD.client_id);
    ELSE
      UPDATE clients SET score = 'risque' WHERE id = COALESCE(NEW.client_id, OLD.client_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_client_score
  AFTER INSERT OR UPDATE ON factures
  FOR EACH ROW EXECUTE PROCEDURE calculate_client_score();

-- ============================================
-- DONNÉES DE DÉMO (optionnel)
-- Décommenter pour insérer des données de test
-- ============================================
-- INSERT INTO clients (user_id, nom, email, score) VALUES
--   ('YOUR_USER_ID', 'Acme Corp', 'contact@acme.fr', 'bon'),
--   ('YOUR_USER_ID', 'TechStart SAS', 'finance@techstart.fr', 'moyen'),
--   ('YOUR_USER_ID', 'Design Studio', 'hello@design.fr', 'risque');
