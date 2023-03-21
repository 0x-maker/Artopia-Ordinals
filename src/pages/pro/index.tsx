import MarketplaceLayout from '@layouts/Marketplace';
import { NextPage } from 'next';
import Shop from '@containers/Shop';
import { CDN_URL } from '@constants/config';
import useThemeMode from '@hooks/useThemeMode';

const ShopPage: NextPage = () => {
  useThemeMode(true);
  return (
    <MarketplaceLayout theme={'dark'}>
      <Shop />
    </MarketplaceLayout>
  );
};

export default ShopPage;

export async function getServerSideProps() {
  return {
    props: {
      seoInfo: {
        title: 'Generative | Pro',
        description:
          'Buy art on Bitcoin. It’s easy, fast, with zero platform fees.',
        image: `${CDN_URL}/images/image.jpg`,
      },
    },
  };
}
