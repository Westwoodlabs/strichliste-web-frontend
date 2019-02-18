import { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';
import { AppState } from '.';
import {
  Article,
  User,
  getArticleById,
  getArticleList,
  getPayPal,
  getSettings,
  getUser,
  getUserArray,
  getUserBalance,
} from './reducers';

export function useUserName(id: number): string {
  const user = useMappedState<AppState, User | undefined>(
    useCallback(state => getUser(state, id), [])
  );
  return user ? user.name : '';
}

export function useUserBalance(id: number): number {
  return (
    useMappedState<AppState, number | undefined>(
      useCallback(state => getUserBalance(state, id), [])
    ) || 0
  );
}

export function useArticles(): Article[] {
  return useMappedState<AppState, Article[]>(getArticleList);
}

export function useArticle(id: number | undefined) {
  if (id) {
    return useMappedState<AppState, Article | undefined>(
      useCallback((state: AppState) => getArticleById(state, id), [])
    );
  }
  return undefined;
}

export function usePayPalSettings() {
  return useMappedState(getPayPal);
}

export function useSettings() {
  return useMappedState(getSettings);
}

export function useUserArray() {
  return useMappedState(getUserArray);
}
