// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Classification Systems',
      items: [
        'classification/gmfcs',
        'classification/macs',
        'classification/cfcs',
      ],
    },
    {
      type: 'category',
      label: 'Assessment Standards',
      items: [
        'assessment/overview',
        'assessment/cognitive',
        'assessment/functional-independence',
      ],
    },
    {
      type: 'category',
      label: 'Co-occurring Conditions',
      items: [
        'co-occurring/autism-cp',
        'co-occurring/neurological-vs-neurodevelopmental',
      ],
    },
    {
      type: 'category',
      label: 'Clinical Management',
      items: [
        'management/physiatrist-role',
        'management/gait-patterns',
      ],
    },
    {
      type: 'category',
      label: 'Adults with CP',
      items: [
        'adults/late-diagnosis',
      ],
    },
    'references',
  ],
};

module.exports = sidebars;