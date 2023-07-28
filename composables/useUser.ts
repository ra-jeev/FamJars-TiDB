import { User } from '../types';

export const useUser = () => {
  const user = useState<User | undefined>('user', () => undefined);

  return {
    user,
  };
};
