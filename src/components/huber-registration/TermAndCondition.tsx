import React from 'react';

interface BulletPointProps {
  children: React.ReactNode;
}

const BulletPoint: React.FC<BulletPointProps> = ({ children }) => (
  <li className="flex items-start">
    <span className="mr-2 mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-neutral-40" />
    <span>{children}</span>
  </li>
);

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div>
    {title && <h2 className="my-1 text-lg font-bold">{title}</h2>}
    <ul className="!my-0">{children}</ul>
  </div>
);

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

const SubSection: React.FC<SubSectionProps> = ({ title, children }) => (
  <div>
    <h3 className="mb-1 font-semibold">{title}</h3>
    <ul className="!my-0">{children}</ul>
  </div>
);

const TermAndCondition = () => {
  return (
    <div className="flex h-[10rem] flex-col overflow-auto text-sm leading-5 text-neutral-40">
      <Section>
        <BulletPoint>
          Once you have signed up with HuLib, it is important to recognize what
          we are and what we are not. This enables us to manage our expectations
          and deliver on our responsibilities.
        </BulletPoint>
        <BulletPoint>
          We are not an emergency service or crisis helpline. Hubers & HuLib
          staff are not available for support 24/7.
        </BulletPoint>
        <BulletPoint>
          If we have concerns about your well-being and safety, we might need to
          contact a crisis service to support you.
        </BulletPoint>
        <BulletPoint>
          We provide Hubers to listen, inspire, and support you through your
          personal challenges.
        </BulletPoint>
        <BulletPoint>
          Hubers share relatable stories and appropriate knowledge but do not
          provide professional or specialist advice.
        </BulletPoint>
        <BulletPoint>
          Our platform bridges the gap between silence and storytellers.
        </BulletPoint>
        <BulletPoint>
          All conversations are confidential but monitored by our Board of
          Directors to ensure the right support is provided.
        </BulletPoint>
        <BulletPoint>
          If a safety concern arises, emergency services may be contacted.
        </BulletPoint>
        <BulletPoint>
          Prohibited discussions include unhealthy personal relationships,
          unlawful activities, and inappropriate topics.
        </BulletPoint>
      </Section>

      <Section title="ENFORCEMENT">
        <BulletPoint>
          We are not a crisis helpline – crisis service contacts are available
          on the app and website.
        </BulletPoint>
        <BulletPoint>
          No harassment, hate speech, bullying, or targeted attacks.
        </BulletPoint>
        <BulletPoint>No spam, scams, or catfishing.</BulletPoint>
        <BulletPoint>No sharing of personal information.</BulletPoint>
        <BulletPoint>No offensive language or behavior.</BulletPoint>
        <BulletPoint>
          HuLib is not responsible for misinformation provided by users.
        </BulletPoint>
        <BulletPoint>
          HuLib content cannot be used for commercial purposes.
        </BulletPoint>
      </Section>

      <Section title="FOR HUBERS">
        <SubSection title="A. Before Signing Up">
          <BulletPoint>
            All communication must take place on the app.
          </BulletPoint>
          <BulletPoint>
            Do not communicate with a Liber outside of HuLib.
          </BulletPoint>
          <BulletPoint>Report any life-threatening situations.</BulletPoint>
          <BulletPoint>
            Meeting schedules should be followed, and changes should be
            communicated in advance.
          </BulletPoint>
          <BulletPoint>
            Protect your mental health and well-being. You can withdraw from
            conversations if needed.
          </BulletPoint>
        </SubSection>

        <SubSection title="B. In the Session">
          <BulletPoint>Respect {" everyone's "} story.</BulletPoint>
          <BulletPoint>Be kind and considerate.</BulletPoint>
          <BulletPoint>Maintain a safe and supportive space.</BulletPoint>
          <BulletPoint>
            Protect confidentiality and avoid sharing harmful content.
          </BulletPoint>
          <BulletPoint>Engage with purpose and uphold integrity.</BulletPoint>
          <BulletPoint>
            Share responsibly and avoid spreading misinformation.
          </BulletPoint>
          <BulletPoint>
            Participation is entirely voluntary. Both Hubers and Libers can
            pause or end a conversation at any time.
          </BulletPoint>
        </SubSection>

        <SubSection title="C. Addressing Violations">
          <BulletPoint>First violation: Friendly reminder.</BulletPoint>
          <BulletPoint>Second violation: Temporary suspension.</BulletPoint>
          <BulletPoint>
            Repeated or serious violations: Permanent removal from HuLib.
          </BulletPoint>
          <BulletPoint>
            If you believe a decision was made in error, you may communicate
            with our team.
          </BulletPoint>
        </SubSection>
      </Section>

      <Section title="ACKNOWLEDGMENT">
        <BulletPoint>
          By being part of HuLib, you agree to abide by these guidelines and
          contribute to our shared mission.
        </BulletPoint>
        <BulletPoint>
          All sessions are voluntary, and both Hubers and Libers have the right
          to pause or end a conversation immediately.
        </BulletPoint>
        <p className="mt-2">{"Let's "} build something amazing together!</p>
      </Section>
    </div>
  );
};

export default TermAndCondition;
