import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import {
  SEO_DESCRIPTION,
  SEO_IMAGE,
  SEO_TITLE,
} from '@constants/seo-default-info';
import GenerativeTokenDetail from '@containers/GenerativeTokenDetail';
import MarketplaceLayout from '@layouts/Marketplace';
import { getProjectDetail } from '@services/project';
import { getTokenUri } from '@services/token-uri';
import { formatBTCPrice, formatEthPrice, formatTokenId } from '@utils/format';
import { filterCreatorName } from '@utils/generative';
import { GetServerSidePropsContext, NextPage } from 'next';

const GenerativeTokenDetailPage: NextPage = () => {
  return (
    <MarketplaceLayout isDrops={true}>
      <GenerativeTokenDetail />
    </MarketplaceLayout>
  );
};

export default GenerativeTokenDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { tokenID, projectID } = query as {
    tokenID: string;
    projectID: string;
  };
  try {
    const projectData = await getProjectDetail({
      contractAddress: GENERATIVE_PROJECT_CONTRACT,
      projectID: projectID,
    });
    const tokenData = await getTokenUri({
      contractAddress: GENERATIVE_PROJECT_CONTRACT,
      tokenID,
    });
    const isFromAuthentic = tokenData.project.fromAuthentic;
    const tokenName = `${tokenData.project.name} #${formatTokenId(
      isFromAuthentic
        ? tokenData.project?.nftTokenId || ''
        : tokenData.project?.tokenID || ''
    )} by ${filterCreatorName(projectData)}`;

    const isBuyable = tokenData && tokenData.buyable && tokenData.sell_verified;
    const isBuyBTC = isBuyable && !!tokenData.priceBTC && !!tokenData?.orderID;
    const isBuyETH = isBuyable && !!tokenData.priceETH;

    let tokenDescription = '';
    if (isBuyBTC) {
      tokenDescription += `${formatBTCPrice(tokenData.priceBTC)} BTC`;
    }
    if (isBuyETH) {
      tokenDescription += ` (${formatEthPrice(tokenData.priceETH)} ETH)`;
    }

    return {
      props: {
        seoInfo: {
          title: `${tokenName}`,
          description: tokenDescription,
          image: tokenData.thumbnail || SEO_IMAGE,
        },
      },
    };
  } catch (e) {
    return {
      props: {
        seoInfo: {
          title: SEO_TITLE,
          description: SEO_DESCRIPTION,
          image: SEO_IMAGE,
        },
      },
    };
  }
}
