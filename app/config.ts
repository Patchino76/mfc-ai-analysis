const config = {
    development: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    },
    production: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://em-m-db4.ellatzite-med.com:8000'
    }
};

const environment = process.env.NODE_ENV || 'development';
export const apiBaseUrl = config[environment as keyof typeof config].apiUrl;
