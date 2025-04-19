import { authClient } from './stores/auth';

export const getAuthHeaders = async () => {
  const cookies = await authClient.getCookie();
  return {
    Cookie: cookies
  };
};
