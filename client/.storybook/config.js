import { configure, addParameters, addDecorator, setAddon } from '@storybook/react';
import manifoldContext from "./decorators/manifoldContext";
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import JSXAddon from 'storybook-addon-jsx';

// the storybook theme, not to be confused with the manifold theme, below.
import theme from "./theme";

// Import global styles.
import "theme";

// Load all files ending in .stories.js
const req = require.context('../src', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// Apply the theme
addParameters({
  options: { theme }
});

setAddon(JSXAddon);

// Apply a few wrapper components (store provider, router, visual context)
addDecorator(withA11y);
addDecorator(manifoldContext);
addDecorator(withKnobs);

// Configure the things.
configure(loadStories, module);
