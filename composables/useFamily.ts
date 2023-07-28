import { Family } from '../types';

export const useFamily = () => {
  const family = useState<Family | undefined>('family', () => undefined);

  return { family };
};
