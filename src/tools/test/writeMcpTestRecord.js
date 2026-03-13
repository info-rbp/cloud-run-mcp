import { writeMcpTestRecord } from '../../services/firestore/mcpTestRecords.js';
import { assertNonEmptyString } from '../../utils/errors.js';
import { jsonToolError, jsonToolResponse } from '../../utils/responses.js';

export async function writeMcpTestRecordTool(input) {
  try {
    assertNonEmptyString(input?.key, 'key');
    assertNonEmptyString(input?.value, 'value');

    const record = await writeMcpTestRecord({
      key: input.key.trim(),
      value: input.value,
    });

    return jsonToolResponse({
      success: true,
      record,
    });
  } catch (error) {
    return jsonToolError(error);
  }
}
