import { create } from './src/create-instance';

async function requestData() {
  try {
    const api = create({ baseUrl: 'http://localhost:2000' });

    api.defaults.headers.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDY4MTgxMzMsImV4cCI6MTcwNjgzOTczMywic3ViIjoie1wiaWRcIjpcIjEwMFwiLFwidHlwZVwiOlwiMVwiLFwicGVybWlzc2lvblwiOlwiMVwifSJ9.xMhkCrIxjUDK_-FAXLv3VV5QSt0m1ncjxyn_-Sxvgko';

    const users = await api.get('/v2/users', {
      headers: {
        'x-software-id': '6bd2d55d-79ce-4ea5-bf97-f49d49c44ec3',
      },
    });

    console.log(users.data);
  } catch (error) {
    console.error(error);
  }
}

requestData();
