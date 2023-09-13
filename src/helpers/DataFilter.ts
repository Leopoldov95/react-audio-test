import { Audio, AudioRaw } from "../interfaces/Interfaces";

export class DataFilter {
  static rename_keys(data: AudioRaw[]): Audio[] {
    return data.map((audio) => {
      return {
        date_added: audio["Date Added"],
        description: audio["Description, What is it good for?"],
        music_link: audio["Music Link"],
        notes: audio.Notes,
        time: audio.Time,
        title: audio.Title,
        tone: audio.Tone,
        genre: audio.Genre,
        type: audio.Type,
        download_link: "",
      };
    });
  }

  static parse_data(data: Audio[]) {
    const pattern = /\/([^\/?]+)\.wav/;
    //? try and not have the key names fixed
    data = data.filter((d) => d.title.length > 1);
    data.forEach((d) => {
      let name = null;
      const match = d.music_link.match(pattern);
      if (match) {
        name = `${match[1].replace(/%20/g, "_")}.wav`;
      }
      d.title = name || "UNKOWN";
      d.date_added = new Date(d.date_added);
      d.music_link = d.music_link.replace(
        "www.dropbox.com",
        "dl.dropboxusercontent.com"
      );
      d.time = d.time.replace(/s/g, "");
      const splitted = d.genre.split(",").map((item: any) => item.trim());
      d.genre = splitted;
      d.download_link = d.music_link.replace(/\?dl=0$/, "?dl=1");
    });
    return data;
  }

  static sort_data(data: Audio[], type: string) {
    switch (type) {
      case "newest":
        return data.sort((a: any, b: any) => a.date_added - b.date_added);
      case "oldest":
        return data.sort((a: any, b: any) => b.date_added - a.date_added);
      default:
        return data;
    }
  }

  static filter_data(data: Audio[], form) {
    const { duration, genre, tone } = form;
    // filter duration

    data = data.filter((d) => {
      if (duration.length === 0) return true;
      return duration.includes(d.time);
    });
    // filter by genre
    data = data.filter((d) => d.genre.some((str) => str.includes(genre)));

    // filter by tone
    data = data.filter((d) => d.tone.includes(tone));

    return data;
  }
}
