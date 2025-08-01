export interface User {
  id: string;
  email: string;
}

export interface App {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  userId: string;
  createdAt: number;
}

export interface ImageData {
  uri: string;
  base64: string;
}