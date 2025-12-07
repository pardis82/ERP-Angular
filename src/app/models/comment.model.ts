export interface Icomment {
  id: number;
  postId: number;
  body: string;
}

export type NewComment = Omit<Icomment, 'id'>;
