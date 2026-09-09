"use client";

import { useEffect, useState } from "react";
import { ADVOCATE_DATA_URL, type AdvocateDirectory } from "./portal-data";

export function useDirectory() {
  const [directory, setDirectory] = useState<AdvocateDirectory | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(ADVOCATE_DATA_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Directory request failed");
        return response.json() as Promise<AdvocateDirectory>;
      })
      .then((result) => {
        if (active) setDirectory(result);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return { directory, failed };
}
