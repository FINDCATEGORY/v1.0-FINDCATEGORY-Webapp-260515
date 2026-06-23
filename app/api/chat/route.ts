export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return Response.json({ reply: "안녕하세요! 파인드카테고리 챗봇입니다." });
    }

    const text = message.toLowerCase();
    let reply = "저는 파인드카테고리에 특화된 언어모델로, 파인드카테고리에 관련된 답변만 드릴 수 있습니다.";

    if (text.includes("멤버십") || text.includes("등급") || text.includes("혜택")) {
      reply = "[멤버십 등급 혜택 안내]\n- SOCIAL: 기본 멤버십\n- EDITION: 카달로그 구입 회원 전용 스페셜 에디션 혜택\n- PRESTIGE: 자체 심사를 통과한 최상위 멤버십(모든 프리미엄 혜택 제공)";
    } else if (text.includes("정보") || text.includes("비밀번호") || text.includes("탈퇴") || text.includes("패스키")) {
      reply = "[회원 정보 관리 안내]\n마이페이지의 'Member Profile'에서 비밀번호 변경, 생체인증(패스키) 등록 및 회원탈퇴를 진행하실 수 있습니다.";
    } else if (text.includes("포인트") || text.includes("충전")) {
      reply = "[포인트 관리 안내]\n보유 포인트(P) 실시간 확인 및 포인트 충전은 마이페이지의 '포인트 관리' 메뉴에서 가능합니다.";
    } else if (text.includes("주문") || text.includes("결제") || text.includes("배송")) {
      reply = "[주문/결제 내역 안내]\n결제된 내역 및 주문 상품은 마이페이지의 '최근 주문 내역'에서 바로 확인 가능합니다. (배송 상황 등은 추후 업데이트 예정입니다.)";
    } else if (text.includes("안녕") || text.includes("반가워") || text.includes("하이")) {
      reply = "안녕하세요! 파인드카테고리 어시스턴트입니다. 멤버십, 포인트, 주문 내역 등에 대해 궁금한 점을 말씀해 주시면 안내해 드리겠습니다.";
    }

    return Response.json({ reply });
    
  } catch (error: any) {
    console.error("서버 에러 상세:", error);
    return Response.json({ error: "채팅 응답 중 오류가 발생했습니다." }, { status: 500 });
  }
}