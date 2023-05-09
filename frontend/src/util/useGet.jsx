import { useState, useEffect } from "react";
import axios from "axios";

export default function useGet(url, headers = null, initialState = null) {
  const [data, setData] = useState(initialState);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(url, { headers: headers });
        // console.log(data);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
      }
    }
    fetchData();
  }, [url]);

  return { data, isLoading };
}
