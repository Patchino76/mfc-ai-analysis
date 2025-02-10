// const config = {
//     development: {
//         apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
//     },
//     production: {
//         apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://em-m-db4.ellatzite-med.com:8000'
//     }
// };
const config = {
    development: {
        apiUrl: 'http://localhost:8000' // Hardcoded value
    },
    production: {
        apiUrl: 'http://em-m-db4.ellatzite-med.com:8000'
    }
};
const environment = process.env.NODE_ENV || 'development';
console.log('NODE_ENV:', process.env.NODE_ENV, 'selected environment:', environment);
console.log('apiBaseUrl:', config[environment as keyof typeof config].apiUrl);

console.log('Raw NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Resolved apiUrl:', config[environment as keyof typeof config].apiUrl);

export const apiBaseUrl = config[environment as keyof typeof config].apiUrl;
