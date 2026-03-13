import { toPublicErrorMessage } from './errors.js';

export function jsonToolResponse(payload) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload, null, 2),
      },
    ],
    structuredContent: payload,
  };
}

export function jsonToolError(error) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: toPublicErrorMessage(error) }),
      },
    ],
    isError: true,
  };
}
