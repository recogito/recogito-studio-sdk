import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Annotation, Filter, User } from '@annotorious/react';

export interface FilterSetting<T> {
  state: T;

  filter: (a: Annotation) => boolean;
}

interface FilterStateContextValue {
  hideAll: boolean;

  setHideAll(hideAll: boolean): void;

  layerSettings?: FilterSetting<string[] | undefined>;

  setLayerSettings: React.Dispatch<
    React.SetStateAction<FilterSetting<string[] | undefined> | undefined>
  >;

  contributorSettings?: FilterSetting<User[]>;

  setContributorSettings: React.Dispatch<
    React.SetStateAction<FilterSetting<User[]> | undefined>
  >;

  tagSettings?: FilterSetting<string[]>;

  setTagSettings: React.Dispatch<
    React.SetStateAction<FilterSetting<string[]> | undefined>
  >;

  visibilitySettings?: FilterSetting<'public' | 'private' | 'all'>;

  setVisibilitySettings: React.Dispatch<
    React.SetStateAction<
      FilterSetting<'all' | 'private' | 'public'> | undefined
    >
  >;

  filter?: Filter;
}

// @ts-ignore
const FilterStateContext = createContext<FilterStateContextValue>();

interface FilterStateProps {
  children: ReactNode;
}

export const FilterState = (props: FilterStateProps) => {
  const [hideAll, setHideAll] = useState(false);

  const [layerSettings, setLayerSettings] = useState<
    FilterSetting<string[] | undefined> | undefined
  >();

  const [contributorSettings, setContributorSettings] = useState<
    FilterSetting<User[]> | undefined
  >();

  const [tagSettings, setTagSettings] = useState<
    FilterSetting<string[]> | undefined
  >();

  const [visibilitySettings, setVisibilitySettings] = useState<
    FilterSetting<'all' | 'private' | 'public'> | undefined
  >();

  const [chained, setChained] = useState<Filter | undefined>();

  // Note: this may move into the context provider later
  useEffect(() => {
    if (hideAll) {
      setChained(() => () => false);
      return;
    }

    const filters = [
      layerSettings?.filter,
      contributorSettings?.filter,
      tagSettings?.filter,
      visibilitySettings?.filter,
    ].filter((fn): fn is (a: Annotation) => boolean => Boolean(fn));

    if (filters.length > 0) {
      const chained = (a: Annotation) => filters.every((fn) => fn(a));
      setChained(() => chained);
    } else {
      setChained(undefined);
    }
  }, [hideAll, layerSettings, contributorSettings, tagSettings, visibilitySettings]);

  return (
    <FilterStateContext.Provider
      value={{
        layerSettings,
        setLayerSettings,
        contributorSettings,
        setContributorSettings,
        tagSettings,
        setTagSettings,
        visibilitySettings,
        setVisibilitySettings,
        hideAll,
        setHideAll,
        filter: chained,
      }}
    >
      {props.children}
    </FilterStateContext.Provider>
  );
};

export const useFilterSettingsState = () => useContext(FilterStateContext);

export const useFilter = () => {
  const {
    layerSettings,
    contributorSettings,
    tagSettings,
    visibilitySettings,
    hideAll,
    filter,
  } = useContext(FilterStateContext);

  // Number of filter conditions chained in the filter
  const numConditions = [
    layerSettings,
    contributorSettings,
    tagSettings,
    visibilitySettings,
    hideAll,
  ].filter(Boolean).length;

  return { filter, numConditions };
};
