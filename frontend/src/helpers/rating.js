export function getRating(e) {
  if (e.count === 0) {
    return 0;
  }
  return e.sum / e.count;
}

export function isRated(a, type) {
  if (type === 0) {
    return a.urated;
  } else {
    return a.rrated;
  }
}
