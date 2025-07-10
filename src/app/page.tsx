'use server';

import CarCard from '@/components/carCard/carCard';
import { LoadingContext } from '@/contexts/loadingOverlayContext';
import CarCardContainer from '@/components/carCard/carCardContainer';
import { getCars } from '@/lib/firebase/car/carServer';

import './home.scss';

export default async function Home() {
  // const { setIsLoading } = useContext(LoadingContext);
  // const [data, setData] = useState([]);
  // const fetchCars = async () => {
  //   const res = await getCars();
  //   console.log(res)
  //   if (res) setData(res);
  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchCars();
  // }, []);

  const data = await getCars();
  if (data)
    return (
      <CarCardContainer carList={data} />
    );
}
