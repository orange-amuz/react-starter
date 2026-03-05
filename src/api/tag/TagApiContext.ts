import { createContext } from 'react';
import type ITagApi from './ITagApi';

const TagApiContext = createContext<ITagApi | null>(null);

export default TagApiContext;
