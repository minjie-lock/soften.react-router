import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import qs from 'query-string';
import type { ParseOptions, StringifyOptions } from 'query-string';

export interface Options {
  navigateMode?: 'push' | 'replace';
  parseOptions?: ParseOptions;
  stringifyOptions?: StringifyOptions;
}

type UrlState = Record<string, any>;

const baseParseConfig: ParseOptions = {
  parseNumbers: false,
  parseBooleans: false,
};

const baseStringifyConfig: StringifyOptions = {
  skipNull: false,
  skipEmptyString: false,
};

/**
 * @function useUrlState
 * @description 同步路由参数状态
 * @param initialState 
 * @param options 
 * @returns 
 */
export default function useUrlState<S extends UrlState = UrlState>(
  initialState?: S | (() => S),
  options?: Options,
) {
  type State = Partial<{ [key in keyof S]: any }>;
  const { navigateMode = 'push', parseOptions, stringifyOptions } = options || {};
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mergedParseOptions = { ...baseParseConfig, ...parseOptions };
  const mergedStringifyOptions = { ...baseStringifyConfig, ...stringifyOptions };

  // 获取初始状态
  const initialStateValue = typeof initialState === 'function' ? initialState() : initialState || {};

  // 从 URL 查询参数获取状态
  const queryFromUrl = useMemo(() => {
    return qs.parse(searchParams.toString(), mergedParseOptions);
  }, [searchParams, mergedParseOptions]);

  // 合并初始状态和 URL 查询参数
  const [state, setState] = useState<State>({
    ...initialStateValue,
    ...queryFromUrl,
  });

  // 更新状态并同步到 URL
  const setUrlState = (value: React.SetStateAction<State>) => {
    const updatedState = typeof value === 'function' ? value(state) : value;
    setState(updatedState);

    // 更新 URL 查询参数
    const newQueryString = qs.stringify(
      { ...queryFromUrl, ...updatedState },
      mergedStringifyOptions,
    );

    navigate(`?${newQueryString}`, { replace: navigateMode === 'replace' });
  };

  return [state, setUrlState] as const;
};