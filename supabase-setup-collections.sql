-- B2B 컬렉션 관리를 위한 테이블 생성
CREATE TABLE IF NOT EXISTS public.b2b_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    theme TEXT NOT NULL,
    image_color TEXT DEFAULT 'bg-[#EBEBDF] text-[#4C050C]',
    status TEXT DEFAULT '판매중',
    target_sales INTEGER DEFAULT 500,
    items TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 만약 이미 테이블이 존재한다면 컬럼을 추가합니다.
ALTER TABLE public.b2b_collections ADD COLUMN IF NOT EXISTS items TEXT[] DEFAULT '{}';
ALTER TABLE public.b2b_collections ADD COLUMN IF NOT EXISTS image_url TEXT;

-- RLS 정책 설정 (공개 읽기 및 쓰기 임시 허용)
ALTER TABLE public.b2b_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.b2b_collections
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.b2b_collections
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.b2b_collections
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.b2b_collections
    FOR DELETE USING (true);

-- 기본 더미 데이터 삽입 (초기 세팅용)
INSERT INTO public.b2b_collections (name, theme, image_color, target_sales)
VALUES 
    ('골든아워 컬렉션', '우아함과 따뜻함의 조화', 'bg-amber-100 text-amber-700', 500),
    ('에메랄드 포레스트 컬렉션', '자연의 생동감', 'bg-emerald-100 text-emerald-700', 500),
    ('셀룰리안 모먼트 컬렉션', '모던 럭셔리', 'bg-blue-100 text-blue-700', 500)
ON CONFLICT DO NOTHING;
