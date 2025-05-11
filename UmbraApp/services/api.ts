import { ApiResponse, LoginRequest, SignUpRequest } from '../types/models';
import axios from 'axios';

// Get the base URL from environment variable or use a default
const BASE_URL ='https://9c43-2604-3d09-6b7a-d210-91ba-c67a-9dd7-e7c6.ngrok-free.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout to 10 seconds
  timeout: 10000,
  // Add these settings to help with network issues
  maxRedirects: 5,
  maxContentLength: 50 * 1024 * 1024, // 50MB
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Accept all status codes less than 500
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  request => {
    // Log the full URL being requested
    const fullUrl = `${request.baseURL}${request.url}`;
    console.log('Starting Request:', {
      fullUrl,
      method: request.method,
      data: request.data,
      headers: request.headers
    });
    return request;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No Response Error:', {
        request: error.request,
        message: error.message,
        code: error.code
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export async function SignUp(payload: SignUpRequest): Promise<ApiResponse> {
  try {
    console.log('Attempting signup with payload:', payload);
    // Try to make a test request first
    try {
      await api.get('/health');
      console.log('Server is reachable');
    } catch (error) {
      console.error('Server health check failed:', error);
    }
    
    const response = await api.post<ApiResponse>('/auth/signup', payload);
    console.log('Signup successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('SignUp Error:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Unable to connect to the server. Please check if the server is running at ' + BASE_URL);
      }
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. Please try again.');
      }
      if (error.response?.status === 404) {
        throw new Error('Signup endpoint not found. Please check the API configuration.');
      }
      if (error.message === 'Network Error') {
        throw new Error(`Network Error: Cannot connect to ${BASE_URL}. Please check if the server is running and accessible.`);
      }
    }
    throw error;
  }
}

export async function SignIn(payload: LoginRequest): Promise<ApiResponse> {
  try {
    console.log('Attempting login with payload:', payload);
    const response = await api.post<ApiResponse>('/auth/login', payload);
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('SignIn Error:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Unable to connect to the server. Please check if the server is running at ' + BASE_URL);
      }
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. Please try again.');
      }
      if (error.response?.status === 404) {
        throw new Error('Login endpoint not found. Please check the API configuration.');
      }
      if (error.message === 'Network Error') {
        throw new Error(`Network Error: Cannot connect to ${BASE_URL}. Please check if the server is running and accessible.`);
      }
    }
    throw error;
  }
}

export async function AddGroup(payload: GroupRequest) Promise<ApiResponse> {
  try{
  console.log('Attempting login with paylaod:', payload);
  const response = await api.post<ApiResponse>('/auth')
}
}

