import { readMcpTestRecord } from '../../services/firestore/mcpTestRecords.js';
import { assertNonEmptyString } from '../../utils/errors.js';
import { jsonToolError, jsonToolResponse } from '../../utils/responses.js';

export async function readMcpTestRecordTool(input) {
  try {
    assertNonEmptyString(input?.key, 'key');

    const result = await readMcpTestRecord(input.key.trim());

    return jsonToolResponse(result);
  } catch (error) {
    return jsonToolError(error);
  }
}
