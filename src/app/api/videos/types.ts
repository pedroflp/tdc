type Asset = {
  max_resolution_tier: string;
  created_at: string;
  master_access: string;
  id: string;
  encoding_tier: string;
  status: string;
  mp4_support: string;
  ingest_type: string;
  playback_ids: string[];
  upload_id: string;
};

type Creator = {
  username: string;
  avatar: string;
  name: string;
};

export type VideoProps = {
  deslikes: number;
  title: string;
  asset: Asset;
  createdAt: string;
  id: string;
  creator: Creator;
  likes: number;
  category: string;
  views: number;
};