-- Fix existing titles by removing the " | انجاز نوت" suffix
-- (the root layout template adds it automatically via %s | انجاز نوت)
UPDATE seo SET title = REPLACE(title, ' | انجاز نوت', '') WHERE page_path != '/';

-- Fix the root page if it has the suffix in the wrong place
UPDATE seo SET title = 'انجاز نوت | مكتبة ومركز خدمات عامة' WHERE page_path = '/' AND title = 'انجاز نوت | مكتبة ومركز خدمات عامة | انجاز نوت';
