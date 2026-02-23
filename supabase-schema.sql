-- LinguaGuessr Database Schema
-- Run this in your Supabase SQL Editor to set up the tables

-- Audio clips / language data
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  native_name TEXT,
  audio_url TEXT NOT NULL,
  correct_lat FLOAT NOT NULL,
  correct_lng FLOAT NOT NULL,
  country TEXT NOT NULL,
  fun_fact TEXT,
  difficulty TEXT DEFAULT 'medium'
);

-- Leaderboard
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  total_score INT NOT NULL,
  rounds_played INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Multiplayer rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  host_name TEXT NOT NULL,
  status TEXT DEFAULT 'waiting',
  current_round INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policies: allow public read for all, and insert for scores/rooms
CREATE POLICY "Languages are viewable by everyone" ON languages FOR SELECT USING (true);
CREATE POLICY "Scores are viewable by everyone" ON scores FOR SELECT USING (true);
CREATE POLICY "Anyone can submit a score" ON scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Rooms are viewable by everyone" ON rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create a room" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rooms" ON rooms FOR UPDATE USING (true);

-- Seed language data
INSERT INTO languages (name, native_name, audio_url, correct_lat, correct_lng, country, fun_fact, difficulty) VALUES
('English', 'English', '/audio/english.mp3', 51.5, -0.12, 'United Kingdom', 'English has more words than any other language — over 170,000 in current use.', 'easy'),
('Spanish', 'Espanol', '/audio/spanish.mp3', 40.42, -3.70, 'Spain', 'Spanish is the official language of 20 countries with over 500 million native speakers.', 'easy'),
('French', 'Francais', '/audio/french.mp3', 48.86, 2.35, 'France', 'French was the official language of England for over 300 years after 1066.', 'easy'),
('German', 'Deutsch', '/audio/german.mp3', 52.52, 13.41, 'Germany', 'German has unique compound words — Handschuh (glove) literally means hand shoe.', 'easy'),
('Italian', 'Italiano', '/audio/italian.mp3', 41.90, 12.50, 'Italy', 'Italian became a unified language only in 1861 when Italy was unified.', 'easy'),
('Portuguese', 'Portugues', '/audio/portuguese.mp3', -22.91, -43.17, 'Brazil', 'Portuguese is the most spoken language in the Southern Hemisphere.', 'medium'),
('Russian', 'Russkiy', '/audio/russian.mp3', 55.76, 37.62, 'Russia', 'Russian was the first language spoken in outer space by Yuri Gagarin in 1961.', 'medium'),
('Japanese', 'Nihongo', '/audio/japanese.mp3', 35.68, 139.69, 'Japan', 'Japanese has three writing systems: Hiragana, Katakana, and Kanji.', 'medium'),
('Korean', 'Hangugeo', '/audio/korean.mp3', 37.57, 126.98, 'South Korea', 'Hangul was invented by King Sejong the Great in 1443.', 'medium'),
('Mandarin Chinese', 'Putonghua', '/audio/mandarin.mp3', 39.90, 116.40, 'China', 'Mandarin is a tonal language with 4 tones that change word meanings.', 'medium'),
('Hindi', 'Hindi', '/audio/hindi.mp3', 28.61, 77.21, 'India', 'Hindi and Urdu are mutually intelligible when spoken.', 'medium'),
('Arabic', 'Al-Arabiyya', '/audio/arabic.mp3', 24.71, 46.68, 'Saudi Arabia', 'Algebra, algorithm, and coffee all come from Arabic.', 'medium'),
('Turkish', 'Turkce', '/audio/turkish.mp3', 41.01, 28.98, 'Turkey', 'Turkey switched from Arabic to Latin script overnight in 1928.', 'medium'),
('Thai', 'Phasa Thai', '/audio/thai.mp3', 13.76, 100.50, 'Thailand', 'Thai has 5 tones and 44 consonants in its script.', 'hard'),
('Vietnamese', 'Tieng Viet', '/audio/vietnamese.mp3', 21.03, 105.85, 'Vietnam', 'Vietnamese has 6 tones and uses Latin script with diacritics.', 'hard'),
('Swahili', 'Kiswahili', '/audio/swahili.mp3', -6.79, 39.28, 'Tanzania', 'Swahili is the lingua franca of East Africa, spoken by over 100 million people.', 'hard'),
('Dutch', 'Nederlands', '/audio/dutch.mp3', 52.37, 4.90, 'Netherlands', 'Dutch gave English words like cookie, boss, and Santa Claus.', 'medium'),
('Polish', 'Polski', '/audio/polish.mp3', 52.23, 21.01, 'Poland', 'Polish has 7 grammatical cases and szcz is a normal consonant cluster.', 'hard'),
('Greek', 'Ellinika', '/audio/greek.mp3', 37.98, 23.73, 'Greece', 'Greek has been continuously spoken for over 3,400 years.', 'medium'),
('Hebrew', 'Ivrit', '/audio/hebrew.mp3', 32.07, 34.78, 'Israel', 'Hebrew was revived as a spoken language after nearly 2,000 years.', 'hard'),
('Tamil', 'Tamil', '/audio/tamil.mp3', 13.08, 80.27, 'India', 'Tamil is over 2,000 years old and one of the longest-surviving classical languages.', 'hard'),
('Yoruba', 'Yoruba', '/audio/yoruba.mp3', 6.52, 3.38, 'Nigeria', 'Yoruba is a tonal language spoken by over 50 million people.', 'hard'),
('Indonesian', 'Bahasa Indonesia', '/audio/indonesian.mp3', -6.21, 106.85, 'Indonesia', 'Indonesian has no verb conjugations, gender, or tones.', 'medium'),
('Swedish', 'Svenska', '/audio/swedish.mp3', 59.33, 18.07, 'Sweden', 'Swedish has the unique word lagom meaning just the right amount.', 'medium'),
('Amharic', 'Amarinja', '/audio/amharic.mp3', 9.02, 38.75, 'Ethiopia', 'Amharic uses Geez script with 231 characters.', 'hard');
