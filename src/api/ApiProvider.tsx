import type React from 'react';
import type { ReactNode } from 'react';
import TagApiProvider from './tag/TagApiProvider';
import TodoApiProvider from './todo/TodoApiProvider';


type ProviderComponent = React.ComponentType<{ children: ReactNode }>;

const providers: ProviderComponent[] = [
  TodoApiProvider,
  TagApiProvider,
];

const composeProviders = (providerList: ProviderComponent[]): ProviderComponent => {
  return providerList.reduce<ProviderComponent>(
    (Previous, Current) => {
      return function ComposedProvider({
        children,
      }: {
        children: ReactNode;
      }): ReactNode {
        return (
          <Previous>
            <Current>{children}</Current>
          </Previous>
        );
      };
    },
    ({ children }: { children: React.ReactNode }) => <>{children}</>,
  );
};

const AllProviders = composeProviders(providers);

export default function ApiProviders({
  children,
}: {
  children: React.ReactNode;
}): ReactNode {
  return <AllProviders>{children}</AllProviders>;
}
