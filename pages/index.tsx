import { NextPage, GetStaticProps } from 'next';

import Profile from '@components/Profile';
import SocialMeta from '@components/social-meta';

import algolia from '@utils/algolia';
import { Speaker } from '@speakers';

interface Props {
  speaker: Speaker;
}

interface OgImageProps {
  baseUrl: string;
  speaker: Speaker;
  theme: 'light' | 'dark';
}

const generateOgImage = ({
  baseUrl,
  speaker: {
    objectID,
    fullName,
    social: { twitter },
    tags,
  },
  theme,
}: OgImageProps): string => {
  const generatedTags = tags.length
    ? tags.map((tag) => `tags=${tag}`).join('&')
    : '';
  const urlParams = `**${objectID}**<br/>${fullName}.png?theme=${theme}&md=1&fontSize=75px&images=https://avatars.io/twitter/${twitter}/large&${generatedTags}`;

  return `${baseUrl}/${encodeURIComponent(urlParams)}`;
};

const IndexPage: NextPage<Props> = ({ speaker }) => {
  if (!speaker) {
    return <div>Speaker not found</div>;
  }

  // console.log({ speaker });

  return (
    <>
      <SocialMeta
        image={generateOgImage({
          baseUrl: 'https://og-image.confcitizens.com',
          speaker,
          theme: 'light',
        })}
        title={`${speaker.fullName} | ConfCitizens`}
        url={`https://confcitizens.com/${speaker.objectID}`}
        description={`Hi, I'm ${
          speaker.fullName
        } and I'm an expert in ${speaker.tags.join(', ')}`}
      />

      <Profile data={speaker} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { hits } = await algolia.search('yakovlevyuri');

  // console.log({ hits });

  return {
    props: {
      speaker: hits.find((speaker) => speaker.objectID === 'yakovlevyuri'),
    },
    revalidate: 10,
  };
};

export default IndexPage;
