export interface Writer {
  write(row: string): Promise<void>;
  close(): Promise<void>;
}
