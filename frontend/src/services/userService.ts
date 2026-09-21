// Replace 8084 with 8080 if you haven't explicitly changed your Spring Boot port in application.properties
const BASE_URL = 'http://192.168.1.4:8084/api/users';

export const userService = {
    // 1. Fetch user by ID (GET /me)
   getUserProfile: async (userId: string) => {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`${BASE_URL}/me?ts=${timestamp}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'X-Auth-Id': userId // Pass the ID to the backend safely
                }
            });
            
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    // 2. Save or Update user (PUT /me)
    saveUserProfile: async (userData: { id: string; name: string; bio: string; preferredLanguage: string, profileImageUrl?: string | null; }) => {
        try {
            const response = await fetch(`${BASE_URL}/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Id': userData.id // Extract the ID to use as the auth header
                },
                // Send the rest of the data in the body
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }
};