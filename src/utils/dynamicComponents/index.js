export const fetchComponent = async(componentName) => {
  return (await import(`./../../lib/ai2svelte/${componentName}.svelte`))
    .default;
};
