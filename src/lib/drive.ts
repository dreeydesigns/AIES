import { getAccessToken } from './firebase';
import { DriveFile } from '../types';

const FOLDER_ID = '1TJmBjL9kXbw9CX_kN3MXUiYm0RQXBUzR';

export async function getFolderContents(): Promise<DriveFile[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No access token available');
  }

  const query = `'${FOLDER_ID}' in parents and trashed = false`;
  const fields = 'files(id, name, mimeType, iconLink, thumbnailLink, hasThumbnail, size, modifiedTime, webViewLink)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&orderBy=folder,name`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to fetch folder contents');
  }

  const data = await response.json();
  return data.files || [];
}
