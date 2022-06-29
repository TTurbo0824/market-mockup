import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Item } from '../stores/ItemStore';

interface Response {
  data: Item[];
  loading: boolean;
  error?: string;
}

const loadData = (): Response => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axios.get(process.env.REACT_APP_API_URL + '/items');
        // itemStore.importItemList(result.data.data);
        setData(result.data);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          setLoading(false);
        } else {
          console.log(error);
        }
      }
    };
    fetchData();
  }, []);

  return {data, loading, error};
}

export default loadData;