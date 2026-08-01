"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Bell,
  Shield,
  Palette,
  Link2,
  Database,
  Mail,
  Smartphone,
  Globe,
  Key,
  RefreshCw,
  Check,
  ExternalLink,
  Zap,
} from "lucide-react";

const integrations = [
  {
    id: "salesforce",
    name: "Salesforce CRM",
    description: "고객 및 거래 데이터 동기화",
    connected: true,
    lastSync: "2시간 전",
  },
  {
    id: "kakao",
    name: "카카오 알림톡",
    description: "주문 및 배송 알림 발송",
    connected: true,
    lastSync: "실시간",
  },
  {
    id: "slack",
    name: "Slack",
    description: "팀 알림 및 시스템 경고",
    connected: true,
    lastSync: "실시간",
  },
  {
    id: "google_analytics",
    name: "Google Analytics 4",
    description: "웹사이트 트래픽 및 이벤트 추적",
    connected: false,
    lastSync: null,
  },
];

const notificationSettings = [
  {
    id: "order_updates",
    label: "신규 주문 알림",
    description: "새로운 주문이 접수될 때 알림",
    email: true,
    push: true,
  },
  {
    id: "membership_changes",
    label: "멤버십 승급 알림",
    description: "고객의 멤버십 등급이 변경될 때 알림",
    email: true,
    push: false,
  },
  {
    id: "inquiry_alerts",
    label: "1:1 문의 접수",
    description: "새로운 고객 문의가 등록될 때 알림",
    email: true,
    push: true,
  },
  {
    id: "system_warnings",
    label: "시스템 경고",
    description: "결제 실패, 재고 부족 등 시스템 경고 알림",
    email: true,
    push: true,
  },
];

export function SettingsSection() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState(notificationSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const toggleNotification = (id: string, type: "email" | "push") => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [type]: !n[type] } : n))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#1A1A1A] font-sans">시스템 설정</h2>
        <p className="text-sm font-bold text-[#1A1A1A]/60 mt-1 font-sans">
          관리자 계정 환경 설정 및 외부 서비스 연동 관리
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/50 border border-[#1A1A1A]/10 p-1 rounded-full w-full justify-start overflow-x-auto">
          <TabsTrigger
            value="profile"
            className="rounded-full px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:shadow-md font-bold font-sans text-[#1A1A1A]/60"
          >
            <User className="w-4 h-4 mr-2" />
            프로필
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-full px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:shadow-md font-bold font-sans text-[#1A1A1A]/60"
          >
            <Bell className="w-4 h-4 mr-2" />
            알림
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="rounded-full px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:shadow-md font-bold font-sans text-[#1A1A1A]/60"
          >
            <Link2 className="w-4 h-4 mr-2" />
            연동
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-full px-6 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:shadow-md font-bold font-sans text-[#1A1A1A]/60"
          >
            <Shield className="w-4 h-4 mr-2" />
            보안
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-[#1A1A1A]/10 bg-white rounded-[24px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[#1A1A1A] font-sans">개인 정보</CardTitle>
              <CardDescription className="font-bold text-[#1A1A1A]/60 font-sans">관리자 프로필 및 기본 환경 설정 업데이트</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 bg-white">
                  <AvatarFallback className="bg-[#1A1A1A] text-white text-2xl font-black font-sans">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="bg-white border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-white rounded-full font-bold font-sans">
                    프로필 사진 변경
                  </Button>
                  <p className="text-xs font-bold text-[#1A1A1A]/50 font-sans">JPG, PNG or GIF. 최대 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-bold text-[#1A1A1A] font-sans">성</Label>
                  <Input
                    id="lastName"
                    defaultValue="김"
                    className="bg-white/30 border-[#1A1A1A]/20 focus-visible:ring-[#1A1A1A]/50 rounded-xl font-bold text-[#1A1A1A] font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-bold text-[#1A1A1A] font-sans">이름</Label>
                  <Input
                    id="firstName"
                    defaultValue="도윤"
                    className="bg-white/30 border-[#1A1A1A]/20 focus-visible:ring-[#1A1A1A]/50 rounded-xl font-bold text-[#1A1A1A] font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-[#1A1A1A] font-sans">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="doyun.kim@findcategory.com"
                    className="bg-white/30 border-[#1A1A1A]/20 focus-visible:ring-[#1A1A1A]/50 rounded-xl font-bold text-[#1A1A1A] font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="font-bold text-[#1A1A1A] font-sans">역할</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger className="bg-white/30 border-[#1A1A1A]/20 rounded-xl font-bold text-[#1A1A1A] font-sans">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">최고 관리자 (Admin)</SelectItem>
                      <SelectItem value="manager">운영 매니저 (Manager)</SelectItem>
                      <SelectItem value="cs">CS 매니저 (CS)</SelectItem>
                      <SelectItem value="viewer">조회 전용 (Viewer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#1A1A1A]/10 pt-6">
                <Label htmlFor="timezone" className="font-bold text-[#1A1A1A] font-sans">표준 시간대</Label>
                <Select defaultValue="kst">
                  <SelectTrigger className="bg-white/30 border-[#1A1A1A]/20 w-full md:w-[300px] rounded-xl font-bold text-[#1A1A1A] font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kst">Asia/Seoul (KST)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1A1A1A]/10 bg-white rounded-[24px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[#1A1A1A] font-sans">디스플레이 설정</CardTitle>
              <CardDescription className="font-bold text-[#1A1A1A]/60 font-sans">대시보드 화면 표시 방식 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Palette className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <p className="font-black text-[#1A1A1A] font-sans">다크 모드</p>
                    <p className="text-sm font-bold text-[#1A1A1A]/60 font-sans mt-0.5">인터페이스 어두운 테마 사용</p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <p className="font-black text-[#1A1A1A] font-sans">기준 통화</p>
                    <p className="text-sm font-bold text-[#1A1A1A]/60 font-sans mt-0.5">매출 및 예산 기본 표시 통화</p>
                  </div>
                </div>
                <Select defaultValue="krw">
                  <SelectTrigger className="w-[120px] bg-white/30 border-[#1A1A1A]/20 rounded-xl font-bold text-[#1A1A1A] font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="krw">KRW (₩)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white rounded-full px-8 py-6 font-black font-sans shadow-md"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  변경 사항 저장
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-[#1A1A1A]/10 bg-white rounded-[24px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[#1A1A1A] font-sans">알림 수신 설정</CardTitle>
              <CardDescription className="font-bold text-[#1A1A1A]/60 font-sans">중요 이벤트별 알림 수신 여부 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr,80px,80px] gap-4 pb-4 border-b border-[#1A1A1A]/10 text-sm font-black text-[#1A1A1A]/50 font-sans">
                  <span>알림 유형</span>
                  <span className="text-center flex items-center justify-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    이메일
                  </span>
                  <span className="text-center flex items-center justify-center gap-1.5">
                    <Smartphone className="w-4 h-4" />
                    푸시
                  </span>
                </div>
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className="grid grid-cols-[1fr,80px,80px] gap-4 py-5 border-b border-[#1A1A1A]/5 last:border-0 animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div>
                      <p className="font-black text-[#1A1A1A] font-sans text-base">{notification.label}</p>
                      <p className="text-sm font-bold text-[#1A1A1A]/60 font-sans mt-1">{notification.description}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Switch
                        checked={notification.email}
                        onCheckedChange={() => toggleNotification(notification.id, "email")}
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <Switch
                        checked={notification.push}
                        onCheckedChange={() => toggleNotification(notification.id, "push")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-[#1A1A1A]/10 bg-white rounded-[24px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[#1A1A1A] font-sans">외부 서비스 연동</CardTitle>
              <CardDescription className="font-bold text-[#1A1A1A]/60 font-sans">CRM, 메신저 등 서드파티 앱 연결 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((integration, index) => (
                  <div
                    key={integration.id}
                    className={`p-6 rounded-[20px] border-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                      integration.connected
                        ? "bg-white/10 border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40"
                        : "bg-gray-50 border-gray-100 hover:border-gray-200"
                    }`}
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            integration.connected ? "bg-[#1A1A1A] shadow-lg shadow-[#1A1A1A]/20" : "bg-gray-200"
                          }`}
                        >
                          <Zap
                            className={`w-6 h-6 ${
                              integration.connected ? "text-white" : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className={`font-black font-sans text-lg ${integration.connected ? "text-[#1A1A1A]" : "text-gray-600"}`}>{integration.name}</p>
                          <p className="text-sm font-bold text-gray-500 font-sans mt-0.5">{integration.description}</p>
                        </div>
                      </div>
                      <Badge
                        className={`font-bold font-sans px-3 py-1 rounded-full ${
                          integration.connected
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-gray-200 text-gray-500 border-gray-300"
                        }`}
                      >
                        {integration.connected ? "연결됨" : "미연결"}
                      </Badge>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                      {integration.connected ? (
                        <>
                          <span className="text-xs font-bold text-emerald-700 font-sans">
                            최근 동기화: {integration.lastSync}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl font-bold text-[#1A1A1A] hover:bg-white font-sans">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              동기화
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl font-bold text-red-600 hover:bg-red-50 hover:text-red-700 font-sans">
                              연결 해제
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-gray-400 font-sans">설정되지 않음</span>
                          <Button
                            size="sm"
                            className="h-9 px-5 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white rounded-xl font-bold font-sans shadow-sm"
                          >
                            연결하기
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-[#1A1A1A]/10 bg-white rounded-[24px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[#1A1A1A] font-sans">비밀번호 변경</CardTitle>
              <CardDescription className="font-bold text-[#1A1A1A]/60 font-sans">주기적인 비밀번호 변경으로 계정을 안전하게 보호하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="font-bold text-[#1A1A1A] font-sans">현재 비밀번호</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-white/30 border-[#1A1A1A]/20 focus-visible:ring-[#1A1A1A]/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="font-bold text-[#1A1A1A] font-sans">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="bg-white/30 border-[#1A1A1A]/20 focus-visible:ring-[#1A1A1A]/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-bold text-[#1A1A1A] font-sans">새 비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-white/30 border-[#1A1A1A]/20 focus-visible:ring-[#1A1A1A]/50 rounded-xl"
                  />
                </div>
                <Button className="w-full mt-2 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 rounded-xl font-bold font-sans">
                  비밀번호 업데이트
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1A1A1A]/10 bg-white rounded-[24px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[#1A1A1A] font-sans">2단계 인증 (2FA)</CardTitle>
              <CardDescription className="font-bold text-[#1A1A1A]/60 font-sans">계정에 추가 보안 계층 적용</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[20px] bg-white/20 border border-[#1A1A1A]/10 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#1A1A1A]/10 flex items-center justify-center shadow-sm">
                    <Key className="w-6 h-6 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <p className="font-black text-[#1A1A1A] font-sans text-lg">Google Authenticator</p>
                    <p className="text-sm font-bold text-[#1A1A1A]/60 font-sans mt-0.5">
                      OTP 앱을 이용한 2단계 인증
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold px-3 py-1 font-sans rounded-full">사용 중</Badge>
                  <Button variant="outline" className="bg-white border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-white rounded-xl font-bold font-sans px-6">
                    관리
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1A1A1A]/10 bg-white rounded-[24px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-[#1A1A1A] font-sans">활성 세션</CardTitle>
              <CardDescription className="font-bold text-[#1A1A1A]/60 font-sans">현재 로그인된 기기 및 브라우저 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { device: "MacBook Pro M2", location: "Seoul, KR", current: true, time: "현재 접속 중" },
                  { device: "iPhone 15 Pro", location: "Seoul, KR", current: false, time: "2시간 전" },
                  { device: "Chrome (Windows)", location: "Busan, KR", current: false, time: "1일 전" },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-[#1A1A1A]/5 shadow-sm hover:border-[#1A1A1A]/20 transition-all animate-in fade-in slide-in-from-left-2 gap-4"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                        {session.device.includes("iPhone") ? (
                          <Smartphone className="w-5 h-5 text-[#1A1A1A]" />
                        ) : (
                          <Globe className="w-5 h-5 text-[#1A1A1A]" />
                        )}
                      </div>
                      <div>
                        <p className="text-base font-black text-[#1A1A1A] font-sans flex items-center gap-2">
                          {session.device}
                          {session.current && (
                            <Badge className="bg-[#1A1A1A] text-white border-transparent text-xs px-2 py-0.5 rounded-full font-bold">
                              현재
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm font-bold text-[#1A1A1A]/50 font-sans mt-0.5">
                          {session.location} • {session.time}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <div className="flex justify-end">
                        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold font-sans rounded-xl px-5">
                          연결 끊기
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
