import { apiRequest } from "./userApiService";

// 토큰을 session에서 관리
export const sessionStorageTokenUtils = {
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("accessToken", token);
    }
  },
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("accessToken");
    }
    return null;
  },
  clearToken: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("accessToken");
    }
  },
};

interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

interface ChallengeData {
  challengeId: string;
}

export interface ChallengeListItem {
  challengeId: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  maxParticipants: number;
  participantsCount: number;
  fee: number;
  description: string;
  status: string;
  option: {
    time?: number;
    start?: string;
    end?: string;
  };
  rule: number;
}
interface ChallengeListData {
  content: ChallengeListItem[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
}

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
  }): Promise<ApiResponse<ChallengeData>> {
    try {
      const token = sessionStorageTokenUtils.getToken();
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

  async getChallenges(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<ChallengeListData>> {
    try {
      const token = sessionStorageTokenUtils.getToken();
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const queryParams = new URLSearchParams();
      if (params?.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params?.limit !== undefined)
        queryParams.append("size", params.limit.toString());
      if (params?.type) queryParams.append("type", params.type);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.search) queryParams.append("title", params.search);

      const queryString = queryParams.toString();
      const url = queryString
        ? `/v1/challenges?${queryString}`
        : "/v1/challenges";

      const response = await apiRequest(url, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("챌린지 목록 조회 실패:", error);
      throw error;
    }
  },
};

export const challengeApiService = {
  ...challengeService,
};

export default challengeApiService;
