// original API format
export interface AudioRaw {
  "Date Added": string;
  "Description, What is it good for?": string;
  "Music Link": string;
  Notes: string;
  Time: string;
  Genre: string;
  Title: string;
  Tone: string;
  Type: string;
}

// modified format
export interface Audio {
  date_added: string | Date;
  description: string;
  music_link: string;
  notes: string;
  time: string;
  title: string;
  tone: any;
  genre: any;
  type: string;
  download_link: string;
}

// Audio Props
export interface AudioProps {
  data: Audio;
  isPlaying: boolean;
  handlePlay: VoidFunction;
}
