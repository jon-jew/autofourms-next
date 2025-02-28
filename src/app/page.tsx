'use server';

import CarCard from '@/components/carCard/carCard';
import { LoadingContext } from '@/contexts/loadingOverlayContext';
import { getCars } from '@/lib/firebase/car';

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

  return (
    <div className="car-card-container">
      {data && data.map((car, index ) => 
        <CarCard key={car.id} data={car} index={index} />
      )}
    </div>
  );
}
