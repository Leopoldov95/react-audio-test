import React from "react";
import "./Auth.css";
import { useGoogleLogin } from "@react-oauth/google";
import { useQuery } from "react-query";

const Auth = ({ setUser }) => {
  const regex = /@frequence\.com$/;
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState("");

  const googleTokenQuery = useQuery({
    queryKey: ["googleAuth", response],
    queryFn: () => fetchGoogleDetails(response),
    enabled: false,
  });

  React.useEffect(() => {
    if (response) {
      googleTokenQuery.refetch(); // Manually trigger the query when response changes
    }
  }, [response]);

  React.useEffect(() => {
    if (googleTokenQuery.data) {
      handleGoogleUser(googleTokenQuery.data);
    }
  }, [googleTokenQuery.data]);

  const login: any = useGoogleLogin({
    onSuccess: (res) => handleGoogleAuth(res),
    onError: (error) => console.log("Login Failed:", error),
  });

  // emulates a fetch (useQuery expects a Promise)
  const fetchGoogleDetails = (token) =>
    fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/json",
        },
      }
    ).then((res) => res.json());

  const handleGoogleAuth = (res) => {
    if (!res) return null; // will be an error
    setResponse(res);
  };

  const handleGoogleUser = (details) => {
    const { email } = details;
    const { access_token } = response;
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);

    if (!regex.test(email)) {
      setError("Invalid Email! Email must be a Frequence account.");
      return;
    }

    // set the access_token to localstorage
    localStorage.setItem(
      "token",
      JSON.stringify({
        access_token,
        details,
        expiration,
      })
    );
    setUser(details);
  };

  return (
    <div className="auth">
      {googleTokenQuery.status === "loading" && (
        <div className="loader">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
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
