// https://gist.github.com/6174/6062387
export const getRandomString = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

type QueryParams = { [key: string]: string };

export const paramefy = (queryParams: QueryParams) => {
  return Object.entries(queryParams).reduce(
    (acc, [key, value], index) => (acc += `${index === 0 ? '' : '&'}${key}=${value}`),
    ''
  );
};

export const deparamefy = (urlString: string): QueryParams => {
  if (urlString.includes('?')) {
    urlString = urlString.split('?')[1];
  }

  return urlString.split('&').reduce((acc, next) => {
    const [key, value] = next.split('=');
    return {
      ...acc,
      [key]: value,
    };
  }, {});
};
