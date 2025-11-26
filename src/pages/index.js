import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Reading →
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
        {link && (
          <Link to={link}>Learn more →</Link>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Evidence-based information on cerebral palsy assessment and management for adults">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <Feature
                title="Classification Systems"
                description="Learn about GMFCS, MACS, CFCS and other standardized classification systems used to assess functional abilities in cerebral palsy."
                link="/docs/classification/gmfcs"
              />
              <Feature
                title="Adult Assessment"
                description="Comprehensive information on assessment standards for adults with CP, including cognitive, functional, and quality of life measures."
                link="/docs/assessment/overview"
              />
              <Feature
                title="Late Diagnosis"
                description="Resources and information for adults who were diagnosed later in life or never received comprehensive assessment in childhood."
                link="/docs/adults/late-diagnosis"
              />
            </div>
            <div className="row margin-top--lg">
              <div className="col">
                <div className="text--center">
                  <h2>Evidence-Based Information</h2>
                  <p>
                    All information in this knowledge base is backed by peer-reviewed research,
                    clinical guidelines, and official documentation from recognized medical organizations.
                    Every claim includes citations to legitimate medical sources.
                  </p>
                </div>
              </div>
            </div>
            <div className="row margin-top--lg">
              <div className="col">
                <div className="alert alert--info" role="alert">
                  <strong>Important:</strong> This knowledge base is for educational purposes only.
                  Always consult with qualified healthcare professionals for medical advice and assessment.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}