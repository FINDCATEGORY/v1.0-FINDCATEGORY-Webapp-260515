"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const footerLinks = {
  explore: [
    { label: "제품과소식", href: "#category" },
    { label: "협업", href: "/collection" },
  ],
  about: [
    { label: "", href: "#" },
    { label: "공간스타일링", href: "#" },
    { label: "제품컨설팅", href: "#" },
    { label: "제품판매", href: "#" },
  ],
  service: [
    { label: "이용약관", href: "#" },
    { label: "환불정책", href: "#" },
    { label: "개인정보처리방침", href: "#" },
  ],
};

export function FooterSection() {
  return (
    <footer className="bg-background">
      {/* Main Footer Content */}
      <div className="border-t border-[#4C050C] px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="#hero" className="text-lg font-medium text-[#4C050C]">
              FINDCATEGORYⓇ
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#4C050C]/70">
              지속 가능한 라이프스타일 시나리오를 통해 <br></br>
              파인드카테고리를 만나보세요.
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              사업자번호 : 540 18 01327 <br></br>대표 : 조현우<br></br>
              이메일 : cho@findcategory.co.kr<br></br>
              전화번호 : 01075763031


            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-[#4C050C]">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4C050C]/70 transition-colors hover:text-[#4C050C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-[#4C050C]">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4C050C]/70 transition-colors hover:text-[#4C050C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-[#4C050C]">Service</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  {link.label === "이용약관" || link.label === "환불정책" || link.label === "개인정보처리방침" ? (
                    <Dialog>
                      <DialogTrigger
                        className={`text-sm transition-colors hover:text-[#4C050C] text-left"
                          }`}
                      >
                        {link.label}
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto bg-background p-6 sm:rounded-xl shadow-lg border border-[#4C050C]/10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <DialogHeader>
                          <DialogTitle className="text-[#4C050C] text-xl">{link.label}</DialogTitle>
                          <DialogDescription className="mt-4 space-y-4 text-sm text-[#4C050C] whitespace-pre-line text-left">
                            {link.label === "이용약관" ? `파인드카테고리 이용약관

제 1 조 (목적)
본 약관은 '파인드카테고리'(이하 "회사"라 합니다)가 운영하는 파인드카테고리 라이프스타일 큐레이션 스토어(이하 "스토어"라 합니다)에서 제공하는 인터넷 관련 서비스 및 회원 전용 서비스를 이용함에 있어, "회사"와 "회원"의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.


제 2 조 (정의)
	1	"스토어"란 "회사"가 재화 또는 용역(이하 "재화 등"이라 합니다)을 "회원"에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 "재화 등"을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.
	2	"회원(비즈니스 회원)"이란 본 약관에 동의하고 사업자 정보(사업자등록번호 등)를 제출하여 "회사"로부터 승인을 얻은 법인 또는 개인사업자를 의미합니다. 본 스토어는 일반 개인 소비자의 가입 및 이용을 제한할 수 있습니다.
	3	"공간스타일링"이라 함은 "회원"의 주거 및 상업 공간에 대하여 "회사"가 디자인 기획, 가구 및 소품 큐레이션, 세팅 등을 제공하는 서비스를 말하며, "제품판매"는 스토어를 통해 재화 등을 판매하는 것을 의미합니다.

  제 3 조 (약관의 명시와 개정)
	1	"회사"는 본 약관의 내용을 "회원"이 쉽게 알 수 있도록 "스토어"의 초기 서비스 화면에 게시합니다.
	2	"회사"는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 초기 화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.

  제 4 조 (회원가입 및 승인)
	1	"스토어"의 회원이 되고자 하는 자는 "회사"가 정한 가입 양식에 따라 회원정보를 기입한 후, 사업자등록증 등 "회사"가 요구하는 증빙 서류를 제출하여야 합니다.
	2	"회사"는 제출된 서류를 심사한 후 가입을 승인하며, 사업자 정보가 허위이거나 타인의 명의를 도용한 경우 승인을 거절하거나 사후에 회원 자격을 박탈할 수 있습니다.

  제 5 조 (구매 및 결제 방식)
	1	"회원"은 "스토어"가 제공하는 결제 방식(신용카드, 실시간 계좌이체, 가상계좌 등)을 통해 "재화 등"의 대금을 지급할 수 있습니다.
	2	B2B 거래의 특성상 발급되는 거래명세서 및 인보이스(알림톡/문자/이메일 발송)는 공식 증빙 자료로 활용될 수 있습니다.

  제 6 조 (재판매 및 무단 전재 금지)
	1	"회원"은 "스토어"에서 구매한 콘텐츠, 재화 등을 "회사"의 사전 서면 동의 없이 제3자에게 그대로 재판매하거나 무단으로 전재, 배포할 수 없습니다.
	2	이를 위반하여 발생하는 모든 법적 책임은 "회원"에게 있으며, "회사"는 이로 인한 손해배상을 청구할 수 있습니다.

  제 7 조 (청약철회 및 환불)
	1	"공간스타일링" 서비스는 계약 체결 및 진행 단계에 따라 환불 규정이 차등 적용되며, 구체적인 기준은 별도의 '환불정책'에 따릅니다.
	2	"제품판매"의 경우, 상품 수령 후 7일 이내에 단순 변심에 의한 청약철회가 가능합니다. 단, 맞춤 제작 상품이나 상품 가치가 훼손된 경우에는 환불이 제한될 수 있습니다.

  제 8 조 (면책조항)
	1	"회사"는 천재지변, 전시, 사변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
	2	"회사"는 "회원"의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
	3	"회사"는 "스토어"를 통해 제공되는 콘텐츠 및 정보의 완전성, 적합성에 대해 보증하지 않으며, "회원"이 이를 바탕으로 진행한 비즈니스 결과에 대해 책임을 지지 않습니다.
	4	"회사"는 천재지변, 파업, 자재 수급 지연 등 불가항력적인 사유로 인해 "공간스타일링" 서비스 일정이 지연되는 경우 책임을 지지 않습니다.
	5	"회사"는 "스토어"를 통해 판매되는 제휴 제조사 상품 자체의 결함에 대해서는 1차적인 제조사의 보증 정책을 따르며, "회사"가 직접 제작한 상품에 대해서만 책임을 부담합니다.
	6	"회원"은 "공간스타일링" 진행 전 현장의 특이사항을 "회사"에 고지할 의무가 있으며, 미고지로 인해 발생한 문제에 대하여 "회사"는 책임을 지지 않습니다.
제 9 조 (재판권 및 준거법)
	1	"회사"와 "회원" 간에 발생한 전자상거래 분쟁에 관한 소송은 제기 당시의 "회사" 본점 소재지를 관할하는 법원을 전속관할로 합니다.
	2	본 약관의 해석 및 "회사"와 "회원" 간의 분쟁에는 대한민국 법령을 적용합니다.
[부칙]
본 약관은 2026년 5월 15일부터 시행됩니다.`

                              : link.label === "환불정책" ? `파인드카테고리 환불 및 취소 정책

1. 공간스타일링 서비스 특성에 따른 환불 규정
	•	본 서비스는 고객님의 공간에 맞춘 맞춤형 디자인 및 스타일링을 제공하는 서비스 특성상, 디자인 기획 및 시공(또는 세팅) 진행 단계에 따라 환불 규정이 차등 적용됩니다.
	•	단순 변심으로 인한 취소 및 환불은 디자인 기획 착수 전까지만 전액 가능하며, 이후에는 위약금 및 실비가 공제된 후 환불됩니다.

2. 진행 단계별 환불 기준
	① 계약 체결 및 결제 후 ~ 공간 실측 및 디자인 기획 착수 전
	•	총 결제 금액의 100% 전액 환불
	② 공간 실측 및 디자인 기획 착수 후 ~ 1차 시안 제공 전
	•	총 결제 금액의 80% 환불 (기획비 공제)
	③ 1차 시안 제공 후 ~ 스타일링 세팅(가구/소품 발주 및 배송) 전
	•	총 결제 금액의 50% 환불 (디자인비 공제)
	④ 가구/소품 발주 완료 및 스타일링 세팅 진행 이후
	•	고객 맞춤형으로 발주가 완료된 가구/소품 비용, 기 투입된 인건비 및 운송비 등은 환불이 불가하며, 해당 실비를 제외한 잔여 금액에 한하여 정산 후 환불

3. 환불 예외 및 유의사항
	•	고객님의 귀책사유(연락 두절, 현장 상황 미고지 등)로 인해 서비스 진행이 지연되거나 불가피하게 중단된 경우, 발생한 실비 및 위약금이 청구될 수 있습니다.
	•	서비스 과정에서 제공된 디자인 시안 및 기획안은 파인드카테고리의 지적재산권에 해당하며, 계약 취소 및 환불 이후 이를 무단으로 사용하는 것은 엄격히 금지됩니다.
	•	제품 판매의 경우, 배송 완료 후 7일 이내 상품 가치가 훼손되지 않은 상태에 한하여 단순 변심에 의한 교환/환불이 가능합니다. (왕복 배송비 고객 부담)

  [부칙] 본 정책은 2026년 5월 15일부터 시행됩니다.` :


                                `'파인드카테고리'(이하 "회사")는 고객의 개인정보를 소중히 다루며, 개인정보 보호법 등 관련 법령을 준수하고 있습니다. 회사는 본 개인정보처리방침을 통하여 사장님들이 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.

                            
1. 수집하는 개인정보 항목 및 수집방법
회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
	•	수집항목: 회사명, 대표자명, 사업자등록번호, 담당자 이름, 연락처(전화번호/휴대폰번호), 이메일 주소, 배송지 주소, 결제 기록
	•	수집방법: 웹사이트 회원가입 폼, 주문/결제 양식, 고객센터 상담 채널

  2. 개인정보의 수집 및 이용목적
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
	•	비즈니스 회원 관리: B2B 회원 가입 승인 및 본인 확인, 부정이용 방지, 고지사항 전달
	•	서비스 제공 및 대금 정산: 공간스타일링 서비스 제공, 상품 주문 배송, 인보이스/거래명세서 발송, 결제 환불 처리
	•	마케팅 및 광고 활용: 중간 등급(아카이브) 회원 대상 제품 카탈로그 발송, 신규 서비스 및 이벤트 정보 안내 (동의 시)

  3. 개인정보의 보유 및 이용기간
원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
	•	계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래등에서의 소비자보호에 관한 법률)
	•	대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래등에서의 소비자보호에 관한 법률)
	•	소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래등에서의 소비자보호에 관한 법률)

  4. 개인정보의 파기절차 및 방법
회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하여 파기합니다.

5. 이용자 및 법정대리인의 권리와 그 행사방법
회원은 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지(동의철회)를 요청할 수 있습니다. 개인정보 관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.

6. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항
회사는 회원에게 특화된 맞춤서비스를 제공하기 위해서 회원 정보를 수시로 저장하고 불러오는 ‘쿠키(cookie)’ 등을 운용합니다. 회원은 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저 설정을 통해 모든 쿠키를 허용하거나 거부할 수 있습니다.

7. 개인정보 보호책임자 및 상담 창구
회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보 보호책임자를 지정하고 있습니다.
	•	개인정보 보호책임자: 조현우
	•	이메일: cho@findcategory.co.kr
	•	전화번호: 010 7576 3031

[부칙] 본 방침은 2026년 5월 15일부터 시행됩니다.`}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-[#4C050C]/70 transition-colors hover:text-[#4C050C]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#4C050C] px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-[#4C050C]">
            2026 FINDCATEGORYⓇ. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs transition-colors hover:text-[#4C050C]"
            >
              Instagram
            </Link>
            <Link
              href="#"
              className="text-xs transition-colors hover:text-[#4C050C]"
            >
              YouTube
            </Link>
          </div>
        </div>
      </div>
    </footer >
  );
}