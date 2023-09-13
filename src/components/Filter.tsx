import * as React from "react";
import "./Filter.css";
import { Audio } from "../interfaces/Interfaces";

export const Filter = ({ data, form, setForm }) => {
  // states to store all the possible genres and tones
  const [tones, setTones] = React.useState<any>([]);
  const [genres, setGenres] = React.useState<any>([]);

  React.useEffect(() => {
    const filtered_tones: string[] = [];
    const filtered_genres: string[] = [];
    data.forEach((d: Audio) => {
      // set genres
      d.genre.forEach((j: string) => {
        if (!filtered_genres.includes(j)) {
          filtered_genres.push(j);
        }
      });
      //   set tones
      if (!filtered_tones.includes(d.tone)) {
        filtered_tones.push(d.tone);
      }
    });

    //setTones(filtered_tones);
    setGenres(filtered_genres);
    setTones(filtered_tones);
  }, [data]);

  const resetForm: VoidFunction = () => {
    setForm({ duration: "", genre: "", tone: "" });
  };

  const handleSelectChange = (event, fieldName) => {
    setForm((prevForm) => ({
      ...prevForm,
      [fieldName]: event.target.value,
    }));
  };

  const handleCheckBox = (e: any, fieldName: string) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setForm((prevForm) => ({
      ...prevForm,
      duration: isChecked
        ? [...prevForm.duration, value]
        : prevForm.duration.filter((d) => d !== value),
    }));
  };

  return (
    <div>
      <div id="module__filter">
        <div className="filter__header">
          <h5>Filter by</h5>
          <span onClick={resetForm} className="form__clear">
            Clear
          </span>
        </div>
        <form>
          <div className="form__input">
            <label className="form__label" htmlFor="duration">
              Duration
            </label>
            <div className="form__row">
              <input
                type="checkbox"
                name="duration"
                value="15"
                checked={form.duration.includes("15")}
                onChange={(e) => handleCheckBox(e, "duration")}
              />
              <label>15 sec</label>
            </div>
            <div className="form__row">
              <input
                type="checkbox"
                name="duration"
                value="30"
                checked={form.duration.includes("30")}
                onChange={(e) => handleCheckBox(e, "duration")}
              />
              <label>30 sec</label>
            </div>
          </div>
          <div className="form__input">
            <label className="form__label" htmlFor="genre">
              Genre
            </label>
            <div className="dropdown__container">
              <select
                name="genre"
                id="genre"
                className="input"
                value={form.genre}
                onChange={(e) => handleSelectChange(e, "genre")}
              >
                <option value="">All Genres</option>
                {genres.length > 0 &&
                  genres.map((genre: string, idx: number) => (
                    <option key={idx} value={genre}>
                      {genre}
                    </option>
                  ))}
              </select>
              <i className="fa-solid fa-caret-down"></i>
            </div>
          </div>
          <div className="form__input">
            <label className="form__label" htmlFor="tone">
              Tone
            </label>
            <div className="dropdown__container">
              <select
                name="tone"
                id="tone"
                className="input"
                value={form.tone}
                onChange={(e) => handleSelectChange(e, "tone")}
              >
                <option value="">All Tones</option>
                {tones.length > 0 &&
                  tones.map((tone: string, idx: number) => (
                    <option key={idx} value={tone}>
                      {tone}
                    </option>
                  ))}
              </select>
              <i className="fa-solid fa-caret-down"></i>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
