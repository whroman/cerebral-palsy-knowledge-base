// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Classification',
      link: { type: 'doc', id: 'classification/index' },
      items: [
        'classification/gmfcs',
        'classification/macs',
        'classification/cfcs',
      ],
    },
    {
      type: 'category',
      label: 'Assessment',
      link: { type: 'doc', id: 'assessment/index' },
      items: [
        'assessment/overview',
        'assessment/cognitive',
        'assessment/functional-independence',
      ],
    },
    {
      type: 'category',
      label: 'Co-occurring Conditions',
      link: { type: 'doc', id: 'co-occurring/index' },
      items: [
        'co-occurring/autism-cp',
        'co-occurring/neurological-vs-neurodevelopmental',
      ],
    },
    {
      type: 'category',
      label: 'Management',
      link: { type: 'doc', id: 'management/index' },
      items: [
        'management/physiatrist-role',
        'management/gait-patterns',
      ],
    },
    {
      type: 'category',
      label: 'Adults',
      link: { type: 'doc', id: 'adults/index' },
      items: [
        'adults/late-diagnosis',
      ],
    },
  ],
};

module.exports = sidebars;
