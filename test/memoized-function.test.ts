import memoize from '../src/memoized-function';

describe('Memoize Test Arabic to Roman number converstion', () => {
    it('1. should cache and return the computed value', () => {

        const expensiveFunction = jest.fn((n: number) => n * 2); // Jest function for testing
        const memoizedFunction = memoize(expensiveFunction);

        expect(memoizedFunction(5)).toBe(10);
        expect(expensiveFunction).toHaveBeenCalledTimes(1); // Function called once, as it's the first time with this parameter.

        expect(memoizedFunction(5)).toBe(10);
        expect(expensiveFunction).toHaveBeenCalledTimes(1); // Function not called again, as the result is retrieved from the cache.

        expect(memoizedFunction(10)).toBe(20);
        expect(expensiveFunction).toHaveBeenCalledTimes(2); // Function called with a different parameter, so it's computed and cached.

        expect(memoizedFunction(10)).toBe(20);
        expect(expensiveFunction).toHaveBeenCalledTimes(2); // Function not called again, as the result is retrieved from the cache.

        expect(memoizedFunction(15)).toBe(30);
        expect(expensiveFunction).toHaveBeenCalledTimes(3); // Function called with a different parameter, so it's computed and cached.

        expect(memoizedFunction(15)).toBe(30);
        expect(expensiveFunction).toHaveBeenCalledTimes(3); // Function not called again, as the result is retrieved from the cache.

        expect(memoizedFunction(25)).toBe(50);
        expect(expensiveFunction).toHaveBeenCalledTimes(4); // Function called with a different parameter, so it's computed and cached.

        expect(memoizedFunction(25)).toBe(50);
        expect(expensiveFunction).toHaveBeenCalledTimes(4); // Function not called again, as the result is retrieved from the cache.
    });

    it('2. should cache and return the computed value', () => {

        const expensiveFunction = jest.fn((n: number) => n % 2 == 0); // Jest function for testing
        const memoizedFunction = memoize(expensiveFunction);

        expect(memoizedFunction(5)).toBe(false);
        expect(expensiveFunction).toHaveBeenCalledTimes(1); // Function called once, as it's the first time with this parameter.

        expect(memoizedFunction(5)).toBe(false);
        expect(expensiveFunction).toHaveBeenCalledTimes(1); // Function not called again, as the result is retrieved from the cache.

        expect(memoizedFunction(10)).toBe(true);
        expect(expensiveFunction).toHaveBeenCalledTimes(2); // Function called with a different parameter, so it's computed and cached.

        expect(memoizedFunction(10)).toBe(true);
        expect(expensiveFunction).toHaveBeenCalledTimes(2); // Function not called again, as the result is retrieved from the cache.
    });
});