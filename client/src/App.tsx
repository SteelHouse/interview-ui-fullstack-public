import { useMutation, useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { User } from "@prisma/client";
// @ts-expect-error
import README from "./README.md";
import { AuthContextProvider } from "./components/AuthContext";
import { getBearerAuthorization, removeToken } from "./utils/getToken";
import { getApiUrl } from "./utils/url";

import "./App.css";

async function getMe() {
  const resp = await fetch(getApiUrl(`/me`), {
    headers: { accept: "application/json", ...getBearerAuthorization() },
  });
  return await resp.json();
}

async function getREADME() {
  const resp = await fetch(README, { headers: { accept: "text/plain" } });
  return await resp.text();
}

async function logout() {
  await fetch(getApiUrl(`/auth/logout`), {
    method: "POST",
    headers: { accept: "application/json", ...getBearerAuthorization() },
  });
  return true;
}

function App() {
  const navigate = useNavigate();
  const isHome = useMatch("/");

  const { data: readmeData } = useQuery<string>({
    queryKey: ["readme"],
    queryFn: getREADME,
    retry: 1,
    staleTime: 100000,
  });

  // NOTE: getting rid of 'remove' for now so I can move on to the rest - docs say it should be working / valid, but it's not
  // const { isLoading, data, remove } = useQuery<User, { error: string }>({
  const { isLoading, data } = useQuery<User, { error: string }>({
      queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    retry: false,
    onSuccess(success) {
      if (success) {
        // cutting this out to get past the error
        // remove();
        removeToken();
        navigate("/");
      }
    },
  });

  let view;

  if (isLoading) {
    view = <>Loading</>;
  } else {
    view = <Outlet />;
  }

  return (
    <AuthContextProvider loggedIn={!!data?.id} authing={isLoading}>
      <header className="flex items-center">
        <div className="header-logo flex items-center">
          <NavLink className="flex" to="/" style={{display: 'inline-grid', gridTemplateColumns: `2rem 1fr`, alignItems: 'center', gap: '1rem', fontSize: `var(--font)`}}>
            <img src="https://c.mountain.com/static/assets/img/logos/ui-watermark.svg" alt="Mntn" style={{height: `var(--font-lg)`, clipPath: `polygon(0 0, 2rem 0, 2rem 2rem, 0 5rem)`}} />
            <span>Star Wars</span>
          </NavLink>
        </div>
        <nav className="grid place-center" style={{ alignSelf: "stretch" }}>
          <NavLink to="/characters">Characters</NavLink>
        </nav>
        {data?.id ? (
          <button onClick={() => logoutMutation.mutate()}>Logout</button>
        ) : (
          <NavLink className="button" to="/login">
            Login
          </NavLink>
        )}
      </header>
      <main>
        {isHome && readmeData && (
          <article className="readme">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {readmeData}
            </ReactMarkdown>
          </article>
        )}
        <Suspense fallback={<div>Loading...</div>}>{view}</Suspense>
      </main>
      <footer>
        <div>
          <NavLink to="/">The Interview</NavLink>
        </div>
      </footer>
    </AuthContextProvider>
  );
}

export default App;
