export type StorageFile = {
  key: string;
  size: number;
  lastModified: string | null;
  publicUrl: string;
};

export type ListFilesInput = {
  prefix?: string;
  cursor?: string;
  maxKeys?: number;
};

export type ListFilesOutput = {
  files: StorageFile[];
  nextCursor: string | null;
};

export type SignedUrlInput = {
  key: string;
  contentType?: string;
  contentLength?: number;
  expiresIn?: number;
};

export type SignedUrlOutput = {
  signedUrl: string;
  key: string;
  publicUrl: string;
};
