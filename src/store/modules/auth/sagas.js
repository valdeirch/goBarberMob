import { takeLatest, call, put, all } from 'redux-saga/effects';
import { Alert } from 'react-native';
// import history from '~/services/history';
import api from '~/services/api';

import { signInSucess, signFailure } from './actions';
// import SignIn from '~/pages/SignIn';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (user.provider) {
      Alert.alert('Erro no login', 'Usuário não pode ser prestador');
      return;
    }

    // todas as reqs com token
    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSucess(token, user));

    // history.push('/dashboard');
  } catch (error) {
    Alert.alert('Falha na autentificação', 'Verifique seus dados');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    // history.push('/');
  } catch (error) {
    Alert.alert('Falha no cadastro', 'verifique seus dados');

    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  // history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
