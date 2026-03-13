import { getDb } from './client.js';

const COLLECTION_NAME = 'mcp_test_records';

export async function writeMcpTestRecord({ key, value }) {
  const updatedAt = new Date().toISOString();
  const record = {
    key,
    value,
    updatedAt,
    source: 'mcp',
  };

  const db = await getDb();
  await db.collection(COLLECTION_NAME).doc(key).set(record);
  return record;
}

export async function readMcpTestRecord(key) {
  const db = await getDb();
  const snapshot = await db.collection(COLLECTION_NAME).doc(key).get();

  if (!snapshot.exists) {
    return { exists: false, record: null };
  }

  return {
    exists: true,
    record: snapshot.data(),
  };
}
