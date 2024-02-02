import { create } from './src/create-instance';

async function requestData() {
  try {
    const api = create({ baseUrl: 'http://localhost:2000' });

    api.defaults.headers.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDY4NDU0NzEsImV4cCI6MTcwNjg2NzA3MSwic3ViIjoie1wiaWRcIjpcIjEwMFwiLFwidHlwZVwiOlwiMVwiLFwicGVybWlzc2lvblwiOlwiMVwifSJ9.8JOHMwAdI8l0ZdcHfwZYYYuiO29EXxQyBodVUEIS0GE';

    const users = await api.get('/v2/users', {
      headers: {
        'x-software-id': '6bd2d55d-79ce-4ea5-bf97-f49d49c44ec3',
      },
      params: {
        limit: 5,
      },
    });

    console.log(users);

    console.log(users.data);
  } catch (error) {
    console.error(error);
  }
}

requestData();
