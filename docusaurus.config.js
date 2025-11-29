// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cerebral Palsy Knowledge Base',
  tagline: 'Evidence-based information on cerebral palsy assessment and management for adults',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://whroman.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/cerebral-palsy-knowledge-base/',

  // GitHub pages deployment config.
  organizationName: 'whroman',
  projectName: 'cerebral-palsy-knowledge-base',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: undefined, // Disable edit button for now
          remarkPlugins: [],
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: false, // Disable blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'research',
        path: 'research',
        routeBasePath: 'research',
        sidebarPath: false, // No sidebar for research notes
        editUrl: undefined,
        showLastUpdateTime: true,
        // Exclude CLAUDE.md from being rendered as a page
        exclude: ['CLAUDE.md'],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Cerebral Palsy Knowledge Base',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/research/pubmed-32061920',
            label: 'Research Notes',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Resources',
            items: [
              {
                label: 'GMFCS - CanChild',
                href: 'https://canchild.ca/resources/42-gmfcs-e-r/',
              },
              {
                label: 'MACS Official',
                href: 'https://www.macs.nu/',
              },
              {
                label: 'CFCS Official',
                href: 'http://cfcs.us/',
              },
            ],
          },
          {
            title: 'Guidelines',
            items: [
              {
                label: 'NICE Guidelines',
                href: 'https://www.nice.org.uk/guidance/ng119',
              },
              {
                label: 'AACPDM',
                href: 'https://www.aacpdm.org/',
              },
            ],
          },
        ],
        copyright: `This knowledge base contains information from peer-reviewed sources. All medical claims are cited.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;