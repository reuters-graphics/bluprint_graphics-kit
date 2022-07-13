export const makeScrollerStepsStatic = (steps, aiGraphics) => {
  const scrollerSteps = steps.map(step => ({
      background: aiGraphics[step.Background],
      foreground: step.Foreground,
    })
  );
  return scrollerSteps;
};
