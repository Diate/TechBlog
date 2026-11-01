/* Các thuật toán sắp xếp viết dưới dạng generator.
 * Mỗi lần `yield` là một "bước" mà trình mô phỏng có thể vẽ lên màn hình:
 *   { type: 'compare', i, j }  so sánh a[i] với a[j]
 *   { type: 'swap',    i, j }  vừa hoán đổi a[i] và a[j] (mảng đã đổi)
 * Mảng được sắp xếp tại chỗ (in-place).
 */
(function (global) {
  function swap(a, i, j) {
    [a[i], a[j]] = [a[j], a[i]];
  }

  function* bubbleSort(a) {
    for (let end = a.length - 1; end > 0; end--) {
      let swapped = false;
      for (let i = 0; i < end; i++) {
        yield { type: 'compare', i, j: i + 1 };
        if (a[i] > a[i + 1]) {
          swap(a, i, i + 1);
          swapped = true;
          yield { type: 'swap', i, j: i + 1 };
        }
      }
      if (!swapped) return;
    }
  }

  function* selectionSort(a) {
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) {
        yield { type: 'compare', i: min, j };
        if (a[j] < a[min]) min = j;
      }
      if (min !== i) {
        swap(a, i, min);
        yield { type: 'swap', i, j: min };
      }
    }
  }

  function* insertionSort(a) {
    for (let i = 1; i < a.length; i++) {
      for (let j = i; j > 0; j--) {
        yield { type: 'compare', i: j - 1, j };
        if (a[j - 1] <= a[j]) break;
        swap(a, j - 1, j);
        yield { type: 'swap', i: j - 1, j };
      }
    }
  }

  // Phân hoạch Lomuto, pivot là phần tử cuối.
  function* quickSort(a, lo = 0, hi = a.length - 1) {
    if (lo >= hi) return;
    const pivot = a[hi];
    let p = lo;
    for (let j = lo; j < hi; j++) {
      yield { type: 'compare', i: j, j: hi };
      if (a[j] < pivot) {
        if (p !== j) {
          swap(a, p, j);
          yield { type: 'swap', i: p, j };
        }
        p++;
      }
    }
    if (p !== hi) {
      swap(a, p, hi);
      yield { type: 'swap', i: p, j: hi };
    }
    yield* quickSort(a, lo, p - 1);
    yield* quickSort(a, p + 1, hi);
  }

  global.Sorting = { bubbleSort, selectionSort, insertionSort, quickSort };
})(globalThis);
