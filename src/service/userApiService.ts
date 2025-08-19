// 공통 fetch 함수
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
    options
  );

  if (!response.ok) {
    let errorMessage = `API 요청 실패: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message || errorData.error) {
        errorMessage += ` - ${errorData.message || errorData.error}`;
      }
    } catch (jsonParseError) {
      console.warn("JSON 파싱 실패:", jsonParseError);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const userService = {
  /**
   * 사용자 등록
   * @param {Object} params
   * @param {string} params.provider
   * @param {string} params.oauthId
   * @param {string} params.nickname
   * @param {string} params.character
   * @param {string} [params.bank]
   * @param {string} [params.accountNumber]
   * @returns {Promise<string>}
   */
  async postUsers(params: {
    provider: string;
    oauthId: string;
    nickname: string;
    character: string;
    bank?: string;
    accountNumber?: string;
  }): Promise<string> {
    const response = await apiRequest("/v1/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    return response.data.userId;
  },

  /**
   * 닉네임 유효성 검사
   * @param {Object} params
   * @param {string} params.nickname
   * @returns {Promise<string>}
   */
  async postValidNickname(params: { nickname: string }): Promise<string> {
    const response = await apiRequest("/v1/users/valid/nickname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return response.message;
  },
};

export const userApiService = {
  ...userService,
};

export default userApiService;
