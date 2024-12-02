export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidWithClassValidator(expectedClass: any): R;
    }
  }
}
