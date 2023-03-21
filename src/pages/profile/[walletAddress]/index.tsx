import { DEFAULT_USER_AVATAR } from '@constants/common';
import { SEO_TITLE } from '@constants/seo-default-info';
import Profile from '@containers/Profile';
import MarketplaceLayout from '@layouts/Marketplace';
import { getProfileByWallet } from '@services/profile';
import { ellipsisCenter } from '@utils/format';
import { GetServerSidePropsContext, NextPage } from 'next';

const ProfilePage: NextPage = () => {
  return (
    <MarketplaceLayout>
      <Profile />
    </MarketplaceLayout>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { query } = context;
    const { walletAddress } = query as { walletAddress: string };

    const res = await getProfileByWallet({
      walletAddress: walletAddress.toLowerCase(),
    });

    let title = SEO_TITLE;
    if (res.displayName) {
      title = res.displayName;
    } else if (res.walletAddressBtcTaproot) {
      title = ellipsisCenter({ str: res.walletAddressBtcTaproot });
    }

    return {
      props: {
        seoInfo: {
          title: `${SEO_TITLE} | ${title}`,
          description: res.bio || '',
          image: res.avatar || DEFAULT_USER_AVATAR,
        },
      },
    };
  } catch (err: unknown) {
    return {
      props: {
        seoInfo: {
          title: `${SEO_TITLE} | Profile`,
          image: DEFAULT_USER_AVATAR,
        },
      },
    };
  }
}
