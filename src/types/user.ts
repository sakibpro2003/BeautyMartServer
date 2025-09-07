export type TUser = {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "customer";
    isBlocked: boolean;
    phone: string;
    createdAt: string;
    updatedAt: string;
  };
  