import { AppConfig } from '@/utils/AppConfig';
import type { Story } from '@/libs/services/modules/stories/storiesType';

const SERVICE_KEY = 'hlb-93td6qrktpz6xrm4jj6dejgmffm4ya_pk';
const BASE_URL = `${AppConfig.api.endpoint}/${AppConfig.api.version}`;

export async function fetchStoryDetail(id: number): Promise<Story | null> {
  try {
    const res = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: { 'hulib-service-key': SERVICE_KEY },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}
