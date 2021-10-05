export const fetchComponent = async(componentName) => {
  return (await import(`./../../lib/ai2svelte/${componentName}.svelte`))
    .default;
};

export const makeScrollerSteps = async(steps) => {
  const scrollerSteps = [];
  for (const step of steps) {
    const background = await fetchComponent(step.Background);
    scrollerSteps.push({
      background,
      foreground: step.Foreground,
    });
  }
  return scrollerSteps;
};
