import { paramefy, deparamefy } from './utils';

describe('paramefy', () => {
  it('serializes a query param object into a query string', () => {
    const result = paramefy({ firstParam: 'hello', secondParam: 'there' });
    expect(result).toBe('firstParam=hello&secondParam=there');
  });
});

describe('deparamefy', () => {
  it('deserializes a query string into a query param object', () => {
    const result = deparamefy('firstParam=hello&secondParam=there');
    expect(result).toEqual({ firstParam: 'hello', secondParam: 'there' });
  });

  it('ignores any url bits before the query indicator', () => {
    const result = deparamefy('http://my-app.com?firstParam=hello&secondParam=there');
    expect(result).toEqual({ firstParam: 'hello', secondParam: 'there' });
  });
});
