

/**
 * @function getShortestSubarray
 * @param {*} A
 * @param {*} X
 * @returns float
 */
function getShortestSubarray(A, X) {
    // `start` is the left end of the sliding window
    // `sum` keeps track of the current window's total sum
    let start = 0, sum = 0;

    // This will store the minimum length of any valid subarray we find
    // We initialize it to Infinity so that any real subarray length will be smaller
    let minLength = Infinity;

    // Begin sliding the right end of the window across the array
    for (let end = 0; end < A.length; end++) {
        // Add the current element to the window's sum
        sum += A[end];

        // As long as the current window has a sum >= X, it's a valid candidate
        // But we try to shrink it from the left to see if there's a smaller valid subarray
        while (sum >= X) {
            // Update the minimum length found so far
            // The length of the current window is (end - start + 1)
            minLength = Math.min(minLength, end - start + 1);

            // Now try shrinking the window from the left
            // Remove the element at the start of the window from the sum
            sum -= A[start];

            // Move the start of the window forward
            start++;
        }
        // If sum < X, the window will be expanded in the next iteration (end will increase)
    }

    // If no valid subarray was found, return null
    // (i.e. minLength was never updated from Infinity)
    return minLength === Infinity ? null : minLength;
}


function runDistance(numbers) {
    // slice(1) gets all but the first element.
    // map returns a new value for each of those, and the value
    //returned is the difference between the element and the corresponding
    // element in A

    const distances = numbers
        .slice(1)
        .map((v, i) => (v - numbers[i]).toFixed(2))
        .map(Number);

    return distances;
}

module.exports = { runDistance, getShortestSubarray };
