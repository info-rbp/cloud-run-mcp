import { env } from '../../config/env.js';

let cachedFirestore;
let cachedAdminModules;

async function loadFirebaseAdmin() {
  if (cachedAdminModules) {
    return cachedAdminModules;
  }

  try {
    const appModule = await import('firebase-admin/app');
    const firestoreModule = await import('firebase-admin/firestore');
    cachedAdminModules = {
      appModule,
      firestoreModule,
    };
    return cachedAdminModules;
  } catch {
    throw new Error(
      'firebase-admin is required for Firestore-backed MCP tools. Install dependencies before using write/read tools.'
    );
  }
}

export async function getDb() {
  if (cachedFirestore) {
    return cachedFirestore;
  }

  const { appModule, firestoreModule } = await loadFirebaseAdmin();
  const { applicationDefault, getApps, initializeApp } = appModule;
  const { getFirestore } = firestoreModule;

  const existingApps = getApps();
  const app =
    existingApps.length > 0
      ? existingApps[0]
      : initializeApp({
          credential: applicationDefault(),
          projectId: env.firestoreProjectId,
        });

  cachedFirestore = getFirestore(app);
  return cachedFirestore;
}
