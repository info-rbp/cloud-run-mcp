import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

export function assertNonEmptyString(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new McpError(ErrorCode.InvalidParams, `${fieldName} must be a non-empty string`);
  }
}

export function toPublicErrorMessage(error) {
  if (error instanceof McpError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected internal error';
}
