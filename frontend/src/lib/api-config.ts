export const getApiUrl = () => {
    // If the window is defined (client-side) and we are not on localhost, use the production Render URL.
    // Ensure you set NEXT_PUBLIC_API_URL in your Vercel Environment Variables.
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
        return process.env.NEXT_PUBLIC_API_URL || "https://food-intelligence-backend.onrender.com";
    }

    // Default to local FastAPI server for development
    return "http://localhost:8000";
};
