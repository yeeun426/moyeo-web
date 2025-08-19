import { apiRequest } from "./userApiService";

// 토큰을 메모리에서 관리
let accessToken: string | null = null;

// 토큰 관리 유틸리티
export const tokenUtils = {
  setToken: (token: string) => {
    accessToken = token;
  },
  getToken: (): string | null => {
    return accessToken;
  },
  clearToken: () => {
    accessToken = null;
  },
};

export const challengeService = {
  async MakeChallenge(params: {
    title: string;
    startDate: string;
    endDate: string;
    type: string;
    maxParticipants: number;
    fee: number;
    description: string;
    option: {
      time?: number;
      start?: string;
      end?: string;
    };
    rule: number;
    paymentId: string;
  }): Promise<any> {
    try {
      const token = tokenUtils.getToken();
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const response = await apiRequest("/v1/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(params),
      });
      return response;
    } catch (error) {
      console.error("챌린지 생성 실패:", error);
      throw error;
    }
  },
};

export const challengeApiService = {
  ...challengeService,
};

export default challengeApiService;
