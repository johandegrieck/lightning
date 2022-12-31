// This file contains TypeScript types used throught the project

export interface Post {
  id: number;
  name: string;
  content: string;
  time: number;
  hasPaid: boolean;
}

export interface SongRequest {
  id: number;
  name: string;
  content: string;
  time: number;
  hasPaid: boolean;
  imageUrl: string;
  songName:string;
}