import axios from 'axios';

const API_BASE_URL = '/api';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies with requests
});

// --- User Types ---
// You can move these to a dedicated types file (e.g., src/types/index.ts) later

export interface UserRegistrationData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'voter' | 'committee';
  gender: string;
  date_of_birth: string;
}

export interface UserLoginData {
  email: string;
  password: string;
  role: 'voter' | 'committee';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  gender?: string;
  date_of_birth?: string;
}

interface AuthResponse {
  user: User;
  // In the future, this might also contain a token
  // token?: string;
}

// --- API Functions ---

/**
 * Registers a new user.
 * @param userData The user data for registration.
 * @returns The user data from the backend.
 */
export const registerUser = async (userData: UserRegistrationData): Promise<User> => {
  try {
    // The backend expects a 'name' field, so we combine firstname and lastname.
    const dataToSend = {
      name: `${userData.firstname} ${userData.lastname}`,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      gender: userData.gender,
      date_of_birth: userData.date_of_birth,
    };
    const response = await apiService.post<AuthResponse>('/auth/register', dataToSend);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Throw the error message from the backend API if it exists
      throw new Error(error.response.data.error || 'Registration failed');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};

/**
 * Logs in a user.
 * @param credentials The user's login credentials.
 * @returns The user data from the backend.
 */
export const loginUser = async (credentials: UserLoginData): Promise<User> => {
  try {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Throw the error message from the backend API if it exists
      throw new Error(error.response.data.error || 'Login failed');
    }
    throw new Error('An unknown error occurred during login.');
  }
};

export default apiService;
