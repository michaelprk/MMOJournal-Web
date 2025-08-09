import 'dotenv/config';
import { ping } from '../app/services/supabase';

(async () => {
  const res = await ping();
  console.log(res);
})();


