import { redirect } from "next/navigation";

// 동적 렌더링 강제 (정적 생성 비활성화)
export const dynamic = "force-dynamic";

// 더 구체적인 타입 정의 (Next.js 15+ 호환)
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GoogleCallback({ searchParams }: Props) {
  // searchParams를 Promise로 처리
  const resolvedSearchParams = await searchParams;

  const code =
    typeof resolvedSearchParams?.code === "string"
      ? resolvedSearchParams.code
      : undefined;

  if (!code) {
    console.error("Google OAuth code 없음");
    return <p>로그인 코드가 유효하지 않습니다.</p>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login/google/callback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!data?.data?.jwtAccessToken) {
      console.error("토큰 없음:", data);
      return <p>로그인에 실패했습니다.</p>;
    }

    const { jwtAccessToken, oauthId, newUser } = data.data;

    const nextUrl = newUser
      ? `/info-name?provider=GOOGLE&oauthId=${oauthId}&token=${jwtAccessToken}`
      : `/home?token=${jwtAccessToken}`;

    redirect(nextUrl);
  } catch (err) {
    console.error("Google 로그인 처리 실패:", err);
    return <p>문제가 발생했습니다.</p>;
  }
}
