import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../components/AuthContext";
import { setToken } from "../utils/getToken";
import { getApiUrl } from "../utils/url";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // Interviewee Task - send appropriate headers for basic auth
  const loginRequestOptions = {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${email}:${password}`)}`,
    },
  };
  console.dir(loginRequestOptions);
  const res = await fetch(getApiUrl("/auth/login"), loginRequestOptions);
  console.dir(res);
  return res.json();
};

export const Login = () => {
  const { loggedIn } = useAuthContext();
  const location = useLocation();
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [loginState, updateLogin] = useState({ email: "", password: "" });

  useEffect(() => {
    if (loggedIn) nav("/");
  }, [loggedIn, nav]);

  const doLogin = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: async (data) => {
      // Interviewee Task - store token and redirect to previous path or /
      console.log('login success');
      console.dir(data);
      if (data.token) {
        setToken(data.token);
        await queryClient.fetchQuery({queryKey:["me"]});
        nav(location?.state?.path ?? "/");
      }
    },
  });
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      doLogin.mutate({
        email: loginState.email,
        password: loginState.password,
      });
    },
    [doLogin, loginState]
  );

  console.log('doLogin:');
  console.dir(doLogin);

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        {!!doLogin.error && <span className="error">Error Logging in.</span>}
        {(!!doLogin.data && !!doLogin.data.errorMessage) && <span className="error">{doLogin.data.errorMessage}</span>}
        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            required
            value={loginState.email}
            onChange={(e) =>
              updateLogin((s) => ({ ...s, email: e.target.value }))
            }
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            required
            value={loginState.password}
            onChange={(e) =>
              updateLogin((s) => ({ ...s, password: e.target.value }))
            }
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <section>
        <p>Logins</p>
        <ul>
          <li>email: luke_skywalker@jedi.com</li>
          <li>password: lspassword</li>
          <li>Jedi</li>
        </ul>
        <ul>
          <li>email: darth_sidious@thedarkside.com</li>
          <li>password: dspassword</li>
          <li>Dark Side</li>
        </ul>
      </section>
    </>
  );
};
