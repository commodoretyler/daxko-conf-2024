export interface Category {
  id: string;
  name: string;
  posts?: Post[];
}

export interface Post {
  id: string;
  title: string;
  date: string;
  commentCount: number;
  shareCount: number;
  category: number;
}
