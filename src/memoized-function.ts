// Declare function type
type Func<T, U> = (arg: T) => U;

// Memoize function accept function
export default function memoize<T, U>(fn: Func<T, U>): Func<T, U> {
    const cache: Map<T, U> = new Map();

    return (arg: T): U => { // Return function
        if (cache.has(arg)) { // Check argument in map, If exist then return result
            return cache.get(arg)!;
        }

        // If cache missed, execure the function and store result in Map and return result
        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
}