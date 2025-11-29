import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Cite from '../components/Cite';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Add custom components
  Cite,
};
