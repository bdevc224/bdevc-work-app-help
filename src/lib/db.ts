// FILE: src/lib/db.ts
// Small promise-based wrapper around IndexedDB for storing resumes locally
// in the browser. No external dependency required.

import type { SavedResume, ResumeContent } from '../types/resume';

const DB_NAME = 'resume-builder-db';
const DB_VERSION = 1;
const STORE_NAME = 'resumes';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `resume_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Fetch every saved resume, newest first. */
export async function listResumes(): Promise<SavedResume[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const results = (request.result as SavedResume[]) || [];
      results.sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getResume(id: string): Promise<SavedResume | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result as SavedResume | undefined);
    request.onerror = () => reject(request.error);
  });
}

/** Create a brand-new saved resume from content, return the full record. */
export async function createResume(
  content: ResumeContent,
  title: string,
  thumbnail?: string
): Promise<SavedResume> {
  const now = Date.now();
  const record: SavedResume = {
    ...content,
    id: genId(),
    title: title || content.personalInfo.fullName || 'Untitled Resume',
    thumbnail,
    createdAt: now,
    updatedAt: now,
  };
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve(record);
    tx.onerror = () => reject(tx.error);
  });
}

/** Overwrite an existing saved resume's content + title, bumping updatedAt.
 *  Pass `thumbnail` when a fresh snapshot was captured; omit it to keep the
 *  existing thumbnail (e.g. if capture failed for this save). */
export async function updateResume(
  id: string,
  content: ResumeContent,
  title?: string,
  thumbnail?: string
): Promise<SavedResume> {
  const db = await openDB();
  const existing = await getResume(id);
  const record: SavedResume = {
    ...content,
    id,
    title: title ?? existing?.title ?? content.personalInfo.fullName ?? 'Untitled Resume',
    thumbnail: thumbnail ?? existing?.thumbnail,
    createdAt: existing?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve(record);
    tx.onerror = () => reject(tx.error);
  });
}

/** Duplicate a saved resume (used for "Copy" in history). Returns the new record. */
export async function duplicateResume(id: string): Promise<SavedResume | undefined> {
  const original = await getResume(id);
  if (!original) return undefined;
  const { id: _oldId, createdAt: _c, updatedAt: _u, thumbnail, ...content } = original;
  return createResume(content as ResumeContent, `${original.title} (Copy)`, thumbnail);
}

export async function deleteResume(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
