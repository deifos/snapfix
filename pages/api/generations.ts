import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const { count, error } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head:true});
    if (error) {
      throw new Error(error.message);
    }
    const generations = count;

    res.status(200).json(generations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
