import { useContext } from 'react';
import type ITagApi from './ITagApi';
import TagApiContext from './TagApiContext';

export default function useTagApi(): ITagApi {
  const context = useContext(TagApiContext);

  if (context === null) {
    throw new Error('useTagApi must be used within a TagApiProvider');
  }

  return context;
}
