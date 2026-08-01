export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  categories: string[];
  description: string;
}

export const categoryBanners: Record<string, string> = {
  "default": "/images/collection/goldenhour/goldenhour1.jpg",
  "모든제품": "",
  "플레이트": "",
  "커트러리": "",
  "소품": "",
  "오브제": "",
  "글라스": "",
};

export const products: Product[] = [
  {
    id: 1,
    name: "골든아워 프린지 라피아 매트",
    price: "₩3,600",
    image: "/images/collection/goldenhour/1.png",
    categories: ["소품"],
    description: "라피아 소재의 프린지 장식 테이블 매트입니다. 자연스러운 텍스처가 테이블에 따뜻한 감성을 더해줍니다.",
  },
  {
    id: 2,
    name: "골든아워 라탄 언더 플레이트",
    price: "₩33,200",
    image: "/images/collection/goldenhour/2.png",
    categories: ["플레이트"],
    description: "라탄 소재로 제작된 언더 플레이트입니다. 골든아워 콜렉션의 따뜻한 톤과 어우러져 테이블을 우아하게 연출합니다.",
  },
  {
    id: 3,
    name: "골든아워 엣지 보울",
    price: "₩4,400",
    image: "/images/collection/goldenhour/3.png",
    categories: ["플레이트"],
    description: "섬세한 엣지 디테일이 돋보이는 보울입니다. 수프나 샐러드 등 다양한 요리에 활용할 수 있습니다.",
  },
  {
    id: 4,
    name: "골든아워 딥 플레이트",
    price: "₩10,800",
    image: "/images/collection/goldenhour/4.png",
    categories: ["플레이트"],
    description: "깊이감 있는 디자인의 플레이트입니다. 파스타, 리조또 등 깊은 그릇이 필요한 요리에 잘 어울립니다.",
  },
  {
    id: 5,
    name: "골든아워 엣지 디너플레이트",
    price: "₩12,500",
    image: "/images/collection/goldenhour/5.png",
    categories: ["플레이트"],
    description: "골든아워 콜렉션의 시그니처 엣지 디자인이 적용된 디너플레이트입니다. 일상적인 식사를 특별하게 만들어줍니다.",
  },
  {
    id: 6,
    name: "골든아워 플라워 냅킨",
    price: "₩6,300",
    image: "/images/collection/goldenhour/6.png",
    categories: ["소품"],
    description: "플라워 패턴이 수놓인 패브릭 냅킨입니다. 테이블 세팅에 화사한 포인트를 더해줍니다.",
  },
  {
    id: 7,
    name: "골든아워 리프 냅킨 버클",
    price: "₩1,100",
    image: "/images/collection/goldenhour/7.png",
    categories: ["오브제"],
    description: "리프 모양의 냅킨 버클입니다. 냅킨을 우아하게 고정해 테이블 세팅의 완성도를 높여줍니다.",
  },
  {
    id: 8,
    name: "골든아워 엠버우드 커트러리 set(4pcs)",
    price: "₩8,800",
    image: "/images/collection/goldenhour/8.png",
    categories: ["커트러리"],
    description: "엠버우드 핸들의 커트러리 4종 세트입니다. 포크, 나이프, 스푼이 포함되어 있으며 따뜻한 나무 소재가 골든아워의 감성을 담았습니다.",
  },
  {
    id: 9,
    name: "골든아워 선셋 글라스 시리즈",
    price: "₩4,700",
    image: "/images/collection/goldenhour/9.png",
    categories: ["글라스"],
    description: "노을빛을 담은 선셋 글라스 시리즈입니다. 음료의 색감과 어우러져 감각적인 테이블을 연출합니다.",
  },
  {
    id: 10,
    name: "골든아워 샌드 암포라 화병",
    price: "₩25,100",
    image: "/images/collection/goldenhour/10.png",
    categories: ["오브제"],
    description: "모래빛 암포라 형태의 화병입니다. 꽃을 꽂거나 단독으로 오브제로 활용하기에도 아름다운 디자인입니다.",
  },
  {
    id: 11,
    name: "골든아워 테이블클로스",
    price: "₩11,700",
    image: "/images/collection/goldenhour/11.png",
    categories: ["소품"],
    description: "골든아워 콜렉션의 무드를 담은 테이블클로스입니다. 부드러운 소재와 따뜻한 컬러로 테이블 전체 분위기를 완성합니다.",
  },
  {
    id: 12,
    name: "셀룰리안 모먼트 모닝 듀 테이블 매트",
    price: "₩3,600",
    image: "/images/collection/cellullianmoment/1.png",
    categories: ["소품"],
    description: "셀룰리안 모먼트 콜렉션의 이슬을 머금은 듯한 디자인의 테이블 매트입니다.",
  },
  {
    id: 13,
    name: "셀룰리안 모먼트 우븐 라탄 플레이트",
    price: "₩18,500",
    image: "/images/collection/cellullianmoment/3.png",
    categories: ["플레이트"],
    description: "정교하게 짜인 라탄 디테일이 돋보이는 플레이트입니다. 자연스러운 텍스처가 야외 식사의 무드를 더해줍니다.",
  },
  {
    id: 14,
    name: "셀룰리안 모먼트 플로럴 엠보싱 디너 플레이트",
    price: "₩22,000",
    image: "/images/collection/cellullianmoment/6.png",
    categories: ["플레이트"],
    description: "가장자리의 우아한 플로럴 엠보싱이 특징인 화이트 디너 플레이트입니다. 어떤 요리를 담아도 돋보이게 해줍니다.",
  },
  {
    id: 15,
    name: "셀룰리안 모먼트 플로럴 엠보싱 딥 보울",
    price: "₩19,500",
    image: "/images/collection/cellullianmoment/7.png",
    categories: ["플레이트"],
    description: "플로럴 엠보싱 장식의 딥 보울입니다. 수프나 샐러드 등을 넉넉하게 담기에 적합하며 지적인 우아함을 선사합니다.",
  },
  {
    id: 16,
    name: "셀룰리안 모먼트 블루 플로럴 테이블클로스",
    price: "₩35,000",
    image: "/images/collection/cellullianmoment/9.png",
    categories: ["소품"],
    description: "푸른 꽃 패턴이 싱그러움을 더하는 패브릭 테이블클로스입니다. 야외 피크닉이나 테라스 식사 연출에 제격입니다.",
  },
  {
    id: 17,
    name: "에메랄드 포레스트 우드 핸들 커트러 세트",
    price: "₩28,000",
    image: "/images/collection/emeraldforest/10.png",
    categories: ["커트러리"],
    description: "따뜻한 우드 핸들이 매력적인 커트러리 세트입니다. 에메랄드 포레스트의 자연 친화적인 무드를 완성해줍니다.",
  },
  {
    id: 18,
    name: "에메랄드 포레스트 그린 웨이브 코스터",
    price: "₩8,500",
    image: "/images/collection/emeraldforest/11.png",
    categories: ["소품"],
    description: "그린 컬러의 웨이브 스티치가 포인트인 코스터입니다. 컵이나 작은 디저트 그릇 아래에 깔아 포인트를 주기 좋습니다.",
  },
  {
    id: 19,
    name: "에메랄드 포레스트 그린 라인 디너 플레이트",
    price: "₩24,000",
    image: "/images/collection/emeraldforest/12.png",
    categories: ["플레이트"],
    description: "테두리에 두 줄의 선명한 그린 라인이 들어간 깔끔한 화이트 디너 플레이트입니다.",
  },
  {
    id: 20,
    name: "에메랄드 포레스트 그린 라인 샐러드 플레이트",
    price: "₩18,000",
    image: "/images/collection/emeraldforest/13.png",
    categories: ["플레이트"],
    description: "디너 플레이트와 세트로 활용하기 좋은 사이즈의 그린 라인 샐러드 플레이트입니다.",
  },
  {
    id: 21,
    name: "에메랄드 포레스트 깅엄 체크 냅킨",
    price: "₩12,000",
    image: "/images/collection/emeraldforest/14.png",
    categories: ["소품"],
    description: "클래식한 그린 컬러의 깅엄 체크 패턴 냅킨으로 싱그러운 테이블 세팅을 연출할 수 있습니다.",
  },
  {
    id: 999,
    name: "[PG심사용] 테스트 결제 상품",
    price: "₩100",
    image: "/images/collection/goldenhour/1.png",
    categories: ["소품"],
    description: "결제 시스템(PG) 연동 및 심사를 위한 100원 테스트 결제 전용 상품입니다.",
  },
];
export const collectionTexts: Record<string, { title: string; description: string }> = {
  "default": {
    title: "All Products",
    description: "FINDCATEGORY의 모든 프리미엄 제품을 만나보세요."
  },
  "모든제품": {
    title: "All Products",
    description: "FINDCATEGORY의 모든 프리미엄 제품을 만나보세요."
  },
  "플레이트": {
    title: "Plates & Dishes",
    description: "테이블의 분위기를 결정짓는 감각적인 디자인의 플레이트."
  },
  "커트러리": {
    title: "Cutlery",
    description: "손끝에서 느껴지는 완벽한 밸런스, 프리미엄 커트러리 시리즈."
  },
  "소품": {
    title: "Table Accessories",
    description: "공간과 식탁에 따뜻한 디테일을 더해주는 소품 및 냅킨."
  },
  "오브제": {
    title: "Objects & Decor",
    description: "일상의 풍경을 예술로 바꾸는 독창적인 오브제 컬렉션."
  },
  "글라스": {
    title: "Glassware",
    description: "빛을 아름답게 투영하는 맑고 견고한 글라스웨어."
  }
};
