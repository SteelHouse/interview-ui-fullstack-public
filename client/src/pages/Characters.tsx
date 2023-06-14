import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Characters as CharactersModel } from "@prisma/client";
import { useAuthContext } from "../components/AuthContext";
import { getBearerAuthorization } from "../utils/getToken";

import "./characters.css";

function useDebounce<T = any>(value: T, defaultTimeout = 500): T | undefined {
  const [v, setV] = useState<T | undefined>(value);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    window.clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setV(value);
    }, defaultTimeout);

    return function cleanup() {
      window.clearTimeout(timeout.current);
    };
  }, [value, defaultTimeout]);

  return v;
}

const getCharacters = async (queryObject: any) => {
  const { queryKey } = queryObject;
  const [, name, limit] = queryKey;
  // Interviewee Task - get the search params and send along to characters api
  const p = new URLSearchParams();
  if (name) p.set("name", name);
  if (limit) p.set("limit", limit);
  const res = await fetch(`/characters?${p?.toString()}`, {
    headers: { accept: "application/json", ...getBearerAuthorization() },
  });
  return await res.json();
};

export const Characters = () => {
  const { authing, loggedIn } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCharacter = searchParams.get("modal");
  const limit = parseInt(searchParams?.get("limit") || "25", 10);
  const charname = searchParams?.get("name");
  const chardb = useDebounce(charname);

  const { data } = useQuery<
    unknown,
    unknown,
    { characters: CharactersModel[]; count: number },
    ["characters", string | undefined, number]
  >({
    queryKey: ["characters", chardb ?? undefined, limit],
    queryFn: getCharacters,
    refetchOnWindowFocus: false,
  });

  const nav = useNavigate();

  const modalCharacter = useMemo(() => {
    if (!activeCharacter) return undefined;
    return data?.characters.find((x) => x.id.toString() === activeCharacter);
  }, [activeCharacter, data?.characters]);

  // Interviewee Task - describe
  //  where a better place for this code could be or in general checking authenticated routes/access
  useEffect(() => {
    if (!authing && !loggedIn) {
      nav("/login", {
        state: { path: "/characters" },
        replace: true,
      });
    }
  }, [nav, authing, loggedIn]);

  if (!authing && !loggedIn) {
    return null;
  }

  return (
    <section>
      <div className={`character-page grid ${modalCharacter ? "dimmed" : ""}`}>
        <h2>
          Character{" "}
          <a className="button" href="http://localhost:5001/characters/csv">
            Download Characters
          </a>
        </h2>
        <div className="flex" style={{ gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            autoComplete="off"
            name="character"
            placeholder="Search for character"
            /* Interviewee Task - update search params */
            onChange={(e) => {
              setSearchParams({ name: e.target.value });
            }}
            style={{ fontSize: `var(--font)` }}
          />
          <select
            name="limit"
            /* Interviewee Task - implement a page size select to limit characters returned from api request */
            onChange={(e) => {
              setSearchParams({ limit: e.target.value });
            }}
            style={{ fontSize: `var(--font)` }}
            value={limit}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="-1">All</option>
          </select>
        </div>
      </div>
      {/*
        Intervieee Task - display character list in grid
            default 1 per row
            screen >= 30rem 2 per row
            screen >= 40rem 3 per row
            screen >= 70rem 4 per row
      */}
      <div className="character-list">
        {data?.characters?.map((c, idx) => (
          <button
            key={c.id}
            className="character"
            onClick={() => {
              setSearchParams({ modal: c.id.toString() });
            }}
          >
            <h3 className="character-name">{c.name}</h3>
            <p className="character-by">{c.birth_year}</p>
            {/** load random image from some site */}
            <img
              className="character-img"
              alt={c.name}
              src={`https://picsum.photos/100?random=${idx}`}
              // Interviewee Task - what attribute can be used to prevent immediate loading of images not in viewport??
              loading="lazy"
            />
            <div className="character-details">
              <p>Gender: {c.gender}</p>
              <p>Species: {c.species}</p>
              <p>Height: {c.height}</p>
              <p>Weight: {c.weight}</p>
              <p>Hair Color: {c.hair_color}</p>
            </div>
          </button>
        ))}
      </div>
      {modalCharacter && (
        <Modal
          open
          onClose={() =>
            setSearchParams((prev) => {
              prev.delete("modal");
              return prev;
            })
          }
          name={modalCharacter.name}
          species={modalCharacter.species ?? ""}
        />
      )}
    </section>
  );
};

type ModalProps = {
  open?: boolean;
  onClose?: () => void;

  name: string;
  species: string;
};

const Modal: FC<ModalProps> = (props) => {
  return createPortal(
    <>
      <div className="modal-overlay" />
      <div className="modal" role="dialog" aria-live="assertive">
        <button autoFocus className="modal-close" onClick={props.onClose}>
          X
        </button>
        <h1>{props.name}</h1>
        <p>Species: {props.species}</p>
        {/* Interviewee tasks - add additional attributes */}
      </div>
    </>,
    /* add the container element to mount portal on #modal-portal - a little plain old js */
    document.querySelector("#modal-portal")!
  );
};
