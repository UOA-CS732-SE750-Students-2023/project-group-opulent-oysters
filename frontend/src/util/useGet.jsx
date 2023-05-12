import { useState, useEffect } from "react";
import axios from "axios";

export default function useGet(url, headers = null, initialState = null) {
  const [data, setData] = useState(initialState);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    axios
      .get(url, { headers: headers })
      .then((response) => setData(response.data))
      .catch(function (error) {
        setError(true);
      });
    setLoading(false);
  }, [url]);

  return { data, isLoading, isError };
}
