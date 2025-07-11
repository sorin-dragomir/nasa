// Simple test to verify Jest is working
describe('Basic Jest functionality', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});

// Test vanilla JavaScript features
describe('JavaScript features', () => {
  it('should handle object destructuring', () => {
    const obj = { name: 'test', value: 42 };
    const { name, value } = obj;
    expect(name).toBe('test');
    expect(value).toBe(42);
  });

  it('should handle array operations', () => {
    const arr = [1, 2, 3];
    const doubled = arr.map(x => x * 2);
    expect(doubled).toEqual([2, 4, 6]);
  });
});
