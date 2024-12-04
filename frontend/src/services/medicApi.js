// medicApi.js
const BASE_URL = "http://localhost:5001/api";

export const medicApi = {
  getSymptoms: async () => {
    try {
      const response = await fetch(`${BASE_URL}/symptoms`, {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch symptoms");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      throw new Error("Failed to fetch symptoms");
    }
  },

  getDiagnosis: async (symptoms, gender, yearOfBirth) => {
    try {
      const response = await fetch(`${BASE_URL}/diagnosis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          symptoms,
          gender,
          yearOfBirth,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get diagnosis");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting diagnosis:", error);
      throw new Error("Failed to get diagnosis");
    }
  },

  getIssueInfo: async (issueId) => {
    try {
      const response = await fetch(`${BASE_URL}/issues/${issueId}`, {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get issue info");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting issue info:", error);
      throw new Error("Failed to get issue details");
    }
  },
};

export default medicApi;
