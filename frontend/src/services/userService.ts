// Adjust this URL based on your testing device (iOS, Android, or Physical)
const BASE_URL = 'http://localhost:8081/api/users';

export const userService = {
    // 1. Fetch user by ID (GET)
   getUserProfile: async (userId: string) => {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`${BASE_URL}/${userId}?ts=${timestamp}`, {
                // These headers force the phone to fetch fresh data every single time
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (!response.ok) throw new Error('User not found');
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    // 2. Save or Update user (POST)
    saveUserProfile: async (userData: { id : string; name: string; bio: string; preferredLanguage: string, profileImageUrl?: string | null; }) => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }
};