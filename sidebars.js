// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'intro',
    'symptom-guide',
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: false,
      items: [
        'adults/finding-services',
        'adults/transition',
        'adults/late-diagnosis',
      ],
    },
    {
      type: 'category',
      label: 'Understanding Cerebral Palsy',
      link: { type: 'doc', id: 'classification/index' },
      items: [
        'classification/gmfcs',
        'classification/macs',
        'classification/cfcs',
        {
          type: 'category',
          label: 'Co-occurring Conditions',
          link: { type: 'doc', id: 'co-occurring/index' },
          items: [
            'co-occurring/autism-cp',
            'co-occurring/secondary-conditions',
            'co-occurring/neurological-vs-neurodevelopmental',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Assessment & Evaluation',
      link: { type: 'doc', id: 'assessment/index' },
      items: [
        'assessment/overview',
        'assessment/cognitive',
        'assessment/functional-independence',
      ],
    },
    {
      type: 'category',
      label: 'Treatment & Management',
      link: { type: 'doc', id: 'management/index' },
      items: [
        'management/physiatrist-role',
        'management/pain',
        'management/spasticity',
        'management/equipment',
        'management/gait-patterns',
      ],
    },
    {
      type: 'category',
      label: 'Living with Cerebral Palsy',
      link: { type: 'doc', id: 'adults/index' },
      items: [
        'adults/mental-health',
        'adults/caregiver',
      ],
    },
    'glossary',
  ],
};

module.exports = sidebars;
