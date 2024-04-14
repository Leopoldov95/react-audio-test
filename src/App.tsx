import * as React from "react";
import "./App.css";

import { Audio } from "./interfaces/Interfaces";

// dependencies
import { useQuery } from "react-query";
import { DataFilter } from "./helpers/DataFilter";

// components
import { Filter } from "./components/Filter";
import { AudioModule } from "./components/Audio";
import Auth from "./components/Auth";

const URL =
  "https://script.googleusercontent.com/macros/echo?user_content_key=8eTperNP90tYuIZoEONuoEhOxIXNcNLabtuawyxnuglTW1ULURT0DfkrSnNJVWzxSmH5wG6uPJ3MCviU_En9i3-1rG6WEiD3m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDzCzsG3-ZyloOKurH10R6osUEiLjbB8OkzuikQyZUOE4Qf5HSdPyYo2NrToerLbedTvCsTepXfObnlYwgO3dFdNogzSVR0e9A&lib=Mff1y0x4E02NQnW_8t0G4FMDcgDzYU7tA";

/**TODO
 * 1. Add google auth
 * 2. Create simple email chekcer
 * 3. Store JWT token
 * 4. Optimize assets (don't need to load API everytime we make filter change)
 */

// App will be our state management and data controller
const App = () => {
  const [user, setUser] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [form, setForm] = React.useState({
    duration: [],
    genre: "",
    tone: "",
  });
  const [sort, setSort] = React.useState("newest");

  const [parsed, setParsed] = React.useState<Audio[]>([]);
  const [filteredData, setFilteredData] = React.useState<Audio[]>([]);
  const [currentPlaying, setCurrentPlaying] = React.useState<string | null>(
    null
  );

  const query = useQuery(
    "repoData",
    () => fetch(URL).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  // check if we have a user saved
  React.useEffect(() => {
    let token: any = localStorage.getItem("token");
    if (token) {
      token = JSON.parse(token);
      // make sure that the token has not expired
      const currentDate = new Date();
      const { expiration, details } = token;

      if (new Date(expiration) < currentDate) {
        console.log("token has expired!!!");

        // token has expired
        localStorage.removeItem("token");
        return;
      }

      setUser(details);
    }
    // console.log(token);
  }, []);

  React.useEffect(() => {
    if (query.data) {
      const parsedData = DataFilter.parse_data(
        DataFilter.rename_keys(query.data)
      );
      setParsed(parsedData);

      let filtered = DataFilter.sort_data(parsedData, sort);
      filtered = DataFilter.filter_data(filtered, form);

      setFilteredData(filtered);
    }
  }, [query.data]);

  React.useEffect(() => {
    if (parsed.length > 0) {
      let filtered = DataFilter.sort_data(parsed, sort);
      filtered = DataFilter.filter_data(filtered, form);

      setFilteredData(filtered);
    }
  }, [form, sort]);

  React.useEffect(() => {
    if (user) {
      console.log("We have a user");
      console.log(user);
      query.refetch();
    }
  }, [user]);

  const handlePlay = (key: string) => {
    if (currentPlaying === key) {
      setCurrentPlaying(null); // Clicking on the same component again should pause it
    } else {
      setCurrentPlaying(key);
    }
  };

  const handlePage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  return (
    <div id="app">
      <div className="container">
        {!user ? (
          <Auth setUser={setUser} />
        ) : (
          <>
            <div className="app__header">
              <h1>Pre-edited Music Library</h1>
              {/* <!-- sorting module --> */}
              <div className="app__search">
                <input
                  disabled
                  type="text"
                  name="search"
                  placeholder="Search"
                />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
            <div className="app__content">
              {/* <!-- user filter --> */}
              <div className="app__content__input">
                <div className="input__sort">
                  <label htmlFor="sort">Sort by</label>
                  <div className="dropdown__container">
                    <select
                      className="input"
                      name="sort"
                      id="sort"
                      value={sort}
                      onChange={(e) => handleSort(e)}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                    <i className="fa-solid fa-caret-down"></i>
                  </div>
                </div>
                <Filter data={parsed} form={form} setForm={setForm}></Filter>
              </div>
              <div>
                <div className="app__content__cards">
                  {query.status === "loading" && <h1>Loading....</h1>}
                  {query.status === "success" &&
                    (filteredData.length > 0 ? (
                      filteredData
                        .slice(0, page * 10)
                        .map((audio: Audio) => (
                          <AudioModule
                            key={audio.music_link}
                            data={audio}
                            isPlaying={currentPlaying === audio.music_link}
                            handlePlay={() => handlePlay(audio.music_link)}
                          ></AudioModule>
                        ))
                    ) : (
                      <h1>Sorry, no matches!</h1>
                    ))}
                </div>
                <button
                  disabled={page * 10 >= filteredData.length}
                  onClick={handlePage}
                  id="load__btn"
                >
                  Load More
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
