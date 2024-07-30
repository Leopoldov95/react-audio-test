import React from "react";
import "./Auth.css";
import { useGoogleLogin } from "@react-oauth/google";
import { postAuth } from "../api/api.js";

const Auth = ({ setUser, setData }) => {
  const [error, setError] = React.useState("");

  const login: any = useGoogleLogin({
    onSuccess: (res) => handleGoogleAuth(res),
    //? Maybe throw a UI message for login error?
    onError: (error) => console.log("Google Login Failed:", error),
  });

  //* First line of contact
  const handleGoogleAuth = async (res) => {
    const postReq = await postAuth(res.access_token);
    if (postReq) {
      if (postReq?.message) {
        setError(postReq?.message);
      }

      if (postReq?.data) {
        // API call successful!
        // set the user
        handleGoogleUser(postReq.data.email);
        // store the data
        localStorage.setItem("fetch_data", JSON.stringify(postReq.data.data));
        setData(JSON.parse(postReq.data.data));
      }
    }
  };

  const handleGoogleUser = (email) => {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);

    console.log(email);

    //! I left off here, just need to clean up and set data as state

    // set the access_token to localstorage
    localStorage.setItem(
      "token",
      JSON.stringify({
        email,
        expiration,
      })
    );
    setUser(email);
  };

  return (
    <div className="auth">
      {/* {googleTokenQuery.status === "loading" && (
        <div className="loader">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )} */}
      <div className="container-small">
        <h2>You Must Be Signed In With A Valid Google Account</h2>
        <button onClick={login}>
          Sign In With <img className="icon" src="/google.svg" />
        </button>
        <span>Something Wrong?</span>
        <span>
          Please contact ICT team if you're having trouble signing in.
        </span>
        {error.length > 1 && <span className="error">{error}</span>}
      </div>
    </div>
  );
};

export default Auth;
