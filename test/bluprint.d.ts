declare module '@reuters-graphics/bluprint' {
  interface Bluprint {
    start: (projectName: string) => Promise<void>;
  }

  const bluprint: Bluprint;
  export default bluprint;
}
