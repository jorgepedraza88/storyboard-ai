export type ShotStatus = "pending" | "generating" | "done" | "error";

export type Sequence = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Shot = {
  id: string;
  sequence_id: string;
  title: string;
  description: string;
  camera_shot_type: string | null;
  camera_angle: string | null;
  camera_movement: string | null;
  lens: string | null;
  duration: number;
  dialogue: string | null;
  purpose: string | null;
  position: number;
  image_url: string | null;
  status: ShotStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      sequences: {
        Row: Sequence;
        Insert: Partial<Sequence> & Pick<Sequence, "title">;
        Update: Partial<Sequence>;
        Relationships: [];
      };
      shots: {
        Row: Shot;
        Insert: Partial<Shot> & Pick<Shot, "sequence_id" | "description" | "position">;
        Update: Partial<Shot>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
