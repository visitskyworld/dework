interface MetadataStringAttribute {
  trait_type: string;
  value: string;
}

interface MetadataNumberAttribute {
  trait_type: string;
  value: number;
  display_type: "number";
}

interface MetadataDateAttribute {
  trait_type: string;
  value: number;
  display_type: "date";
}

type MetadataAttribute =
  | MetadataStringAttribute
  | MetadataNumberAttribute
  | MetadataDateAttribute;

export interface Metadata {
  image: string;
  name: string;
  description: string;
  external_url: string;
  background_color: string;
  attributes: MetadataAttribute[];
}

export interface TaskUser {
  imageUrl?: string;
  username: string;
  address?: string;
}

export interface TaskData {
  organization: {
    imageUrl: string;
    name: string;
  };
  task: {
    name: string;
    permalink: string;
    doneAt: string;
  };
  user: TaskUser;
  reviewer?: TaskUser;
}
