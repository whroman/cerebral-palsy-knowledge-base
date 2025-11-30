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
        'getting-started/finding-services',
        'getting-started/transition',
        'getting-started/late-diagnosis',
      ],
    },
    {
      type: 'category',
      label: 'Understanding Cerebral Palsy',
      link: { type: 'doc', id: 'understanding/index' },
      items: [
        'understanding/gmfcs',
        'understanding/macs',
        'understanding/cfcs',
        {
          type: 'category',
          label: 'Co-occurring Conditions',
          link: { type: 'doc', id: 'understanding/co-occurring/index' },
          items: [
            'understanding/co-occurring/autism-cp',
            'understanding/co-occurring/secondary-conditions',
            'understanding/co-occurring/neurological-vs-neurodevelopmental',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Assessment & Evaluation',
      link: { type: 'doc', id: 'assessment/index' },
      items: [
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
        'management/nutrition',
        'management/communication',
        'management/physical-therapy',
        'management/epilepsy',
        'management/orthopedics',
      ],
    },
    {
      type: 'category',
      label: 'Living with Cerebral Palsy',
      link: { type: 'doc', id: 'living/index' },
      items: [
        'living/mental-health',
        'living/caregiver',
        'living/life-expectancy',
      ],
    },
    'glossary',
    'sitemap',
  ],
};

module.exports = sidebars;
