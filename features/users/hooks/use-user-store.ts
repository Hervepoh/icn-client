import { create } from "zustand";

// Define the Permission interface
interface Permission {
    id: string;
    name: string;
}

// Define the RolePermission interface
interface RolePermission {
    permission: Permission;
}

// Define the Role interface
interface Role {
    id: string;
    name: string;
    RolePermission: RolePermission[];
}

// Define the UserRole interface
interface UserRole {
    userId: string;
    roleId: string;
}

// Define the User interface
interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string | undefined;
    unitId: string | undefined;
    roles: UserRole[];
    role: Role;
    ipAddress: string;
    accessToken: string;
    refreshToken: string;
}


type UserState = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));