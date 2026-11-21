export const DEFAULT_COMMENT_COUNT = 50;

export const CommentLimit = {
  Text: {min: 5, max: 1024},
  Rating: {min: 1, max: 5},
} as const;
