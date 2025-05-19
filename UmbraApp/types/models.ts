// User related types
export interface User {
    id: string;
    email: string;
    name: string;
}

// Group related types
export interface Group {
    id: string;
    name: string;
    description: string;
    members: GroupMember[];
    location: {
        latitude: string;
        longitude: string;
    };
    radius: number;
}

export interface GroupMember {
    user_id: string;
    group_id: string;
    role: 'admin' | 'member';
}

// Location related types


// API Response types
export interface ApiResponse {
    valid: boolean;
    error?: string;
    data?: {
        token?: string;
        name?: string;
        email?: string;
        groups?: Group[];
        groupId?: string;
    };
}

// Request types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    email: string;
    password: string;
    name: string;
}

export interface CreateGroupRequest {
    name: string;
    description: string;
}

export interface GroupRequest {
    location: location;
    members: string[];
    name:string;
    radius: number;
}

export interface location {
    latitude: string;
    longitude: string;
}

export interface UpdateLocationRequest {
    groupId: string;
    latitude: number;
    longitude: number;
} 
