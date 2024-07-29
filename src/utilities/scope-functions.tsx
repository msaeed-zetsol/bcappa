export type ApplyFn<T> = (obj: T) => void;

export function apply<T>(obj: T, fn: ApplyFn<T>): T {
  fn(obj);
  return obj;
}

const functions = {
  apply,
};

export default functions;
