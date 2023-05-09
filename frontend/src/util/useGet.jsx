export default function useGet(url, headers = null, initialState = null) {
  const [data, setData] = useState(initialState);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(url, { headers: headers });
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
