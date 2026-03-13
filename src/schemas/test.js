import { z } from 'zod';

export const writeMcpTestRecordSchema = {
  key: z.string().min(1).describe('Document id/key for the test record'),
  value: z.string().min(1).describe('String value to save in the test record'),
};

export const readMcpTestRecordSchema = {
  key: z.string().min(1).describe('Document id/key for the test record'),
};
