export type TProjectData = {
  id: string;
  title: string;
  description: string;
  title_image_url?: string | null;
  created_at: string;
  updated_at: string;
  center?: [number, number] | undefined;
  bbox?: [number, number, number, number] | undefined;
};

export type TProjectWithUrl = {
  id: string;
  title: string;
  url: string;
  title_image_url?: string;
  created_at: string;
};