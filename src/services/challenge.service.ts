import { Challenge } from "@/app/challenges/components/table";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { api, ApiResponse, PaginatedResponse } from "@/services/axios";

// Example API calls
export const challengesApi = {
  // Get all challenges with pagination
  getChallenges: async (
    page: number = 1,
    limit: number = 100,
    skip: number = 0,
    communityId: string,
    search: string,
  ) => {
    try {
      const response = await api.get<PaginatedResponse<Challenge>>(
        `${API_ENDPOINTS.CHALLENGES.LIST}?page=${page}&limit=${limit}&skip=${skip}&communityId=${communityId}&search=${search}`,
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  // Get single challenge
  getChallenge: async (id: string) => {
    try {
      const response = await api.get<ApiResponse<Challenge>>(API_ENDPOINTS.CHALLENGES.GET(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create challenge
  createChallenge: async (data: Partial<Challenge>) => {
    try {
      const response = await api.post<ApiResponse<Challenge>>(API_ENDPOINTS.CHALLENGES.CREATE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update challenge
  updateChallenge: async (id: string, data: Partial<Challenge>) => {
    try {
      const response = await api.post<ApiResponse<Challenge>>(API_ENDPOINTS.CHALLENGES.UPDATE(id), data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete challenge
  deleteChallenge: async (id: string) => {
    try {
      const response = await api.delete<ApiResponse<void>>(API_ENDPOINTS.CHALLENGES.DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create challenge
  createAction: async (data: Partial<Challenge>) => {
    try {
      const response = await api.post<ApiResponse<Challenge>>(API_ENDPOINTS.ACTION.CREATE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update action
  updateAction: async (id: string, data: Partial<Challenge>) => {
    try {
      const response = await api.post<ApiResponse<Challenge>>(API_ENDPOINTS.ACTION.UPDATE(id), data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRewards: async (communityId: string, limit: number = 100, skip: number = 0, search: string = "") => {
    try {
      const response = await api.get<PaginatedResponse<any>>(
        `${API_ENDPOINTS.REWARDS.LIST}?communityId=${communityId}&limit=${limit}&skip=${skip}&search=${search}`,
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  // Create challenge
  assignDistribution: async (id: string, data: any) => {
    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.REWARDS.ASSIGN(id), data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // all
  fetchDistributionRewards: async (challengeId: string) => {
    try {
      const response = await api.get<PaginatedResponse<any>>(`${API_ENDPOINTS.REWARDS.DISTRIBUTION(challengeId)}`);
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  // all
  fetchActions: async (challengeId: string, communityId: string, limit: number = 100, skip: number = 0) => {
    try {
      const response = await api.get<PaginatedResponse<any>>(
        `${API_ENDPOINTS.ACTION.LIST}?challengeId=${challengeId}&communityId=${communityId}&limit=${limit}&skip=${skip}`,
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },
};
