import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { api, ApiResponse, PaginatedResponse } from "@/services/axios";

interface Community {
  id: string;
  name: string;
  description: string;
  // ... other properties
}

interface CommunityStyle {
  lightMode: {
    logo: string;
    banner: string;
  };
  darkMode: {
    logo: string;
    banner: string;
  };
  general: any;
}

interface Community {
  id: string;
  organisationId: string;
  name: string;
  slug: string;
  description: string;
  communityType: string;
  access: string;
  status: string;
  style: CommunityStyle;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CommunityResponse {
  totalCount: number;
  edges: Community[];
}

// Example API calls
export const communityApi = {
  // Get all challenges with pagination
  getCommunities: async (page: number = 1, limit: number = 100, skip: number = 0) => {
    try {
      const response = await api.get<CommunityResponse>(
        `${API_ENDPOINTS.COMMUNITIES.LIST}?page=${page}&limit=${limit}&skip=${skip}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
