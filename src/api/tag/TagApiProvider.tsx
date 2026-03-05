import { useMemo, type ReactNode } from 'react';
import { API_CONFIG } from '@/constants/api_config';
import FakeTagApi from './FakeTagApi';
import TagApi from './TagApi';
import TagApiContext from './TagApiContext';

interface TagApiProviderProps {
  children: ReactNode;
}

export default function TagApiProvider({
  children,
}: TagApiProviderProps): ReactNode {
  const api = useMemo(() => {
    if (API_CONFIG.USE_FAKE) {
      return new FakeTagApi();
    }

    return new TagApi('/api');
  }, []);

  return <TagApiContext.Provider value={api}>{children}</TagApiContext.Provider>;
}
