import { fetchApi } from "@/services/api/fetchApi";

export async function getVideos() {
  const response = await fetchApi("videos");
  const data = await response.json();
  return data;
}

export async function uploadVideo({
  uploadId, title, category
}: {[key: string]: string}) {
  const response = await fetchApi('videos', {
    method: 'POST',
    body: JSON.stringify({
      uploadId,
      title,
      category
    }),
  });
  const data = await response.json();
  return data;
}