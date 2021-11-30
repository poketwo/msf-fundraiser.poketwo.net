import { useEffect, useState } from "react";

export const useTime = (refreshCycle = 100) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    (async () => {
      const resp = await fetch("/api/date");
      if (!resp.ok) return;

      const datetime = await resp.text();
      const offset = Number(datetime) - Date.now();
      const intervalId = setInterval(() => {
        setNow(new Date(Date.now() + offset));
      }, refreshCycle);

      return () => clearInterval(intervalId);
    })();
  }, [refreshCycle, setInterval, clearInterval, setNow]);

  return now;
};
