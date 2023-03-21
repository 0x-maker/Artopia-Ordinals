import Text from '@components/Text';
import Heading from '@components/Heading';
import { formatBTCPrice } from '@utils/format';
import { useContext, useMemo, useState } from 'react';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { IProjectMarketplaceData } from '@interfaces/api/project';
import useAsyncEffect from 'use-async-effect';
import { projectMarketplaceData } from '@services/project';
import s from './ProjectStats.module.scss';
import { getFirstSaleStats } from '@services/marketplace';

export const ProjectStats = (): JSX.Element => {
  const { project, isRoyalty } = useContext(ProjectLayoutContext);
  const [marketplaceData, setMarketplaceData] =
    useState<IProjectMarketplaceData>();
  const [firstSaleVal, setFirstSaleVal] = useState<string | null>(null);

  useAsyncEffect(async () => {
    if (project?.tokenID && project?.contractAddress) {
      const data = await projectMarketplaceData({
        projectId: String(project?.tokenID),
        contractAddress: String(project?.contractAddress),
      });
      setMarketplaceData(data);
    }
  }, [project]);

  useAsyncEffect(async () => {
    if (project?.tokenID) {
      const data = await getFirstSaleStats({
        projectID: project.tokenID,
      });
      if (data?.amount) {
        setFirstSaleVal(data?.amount);
      }
    }
  }, [project]);

  const totalSale = useMemo((): string | null => {
    if (marketplaceData?.volume !== undefined && firstSaleVal !== null) {
      const total = Number(marketplaceData.volume) + Number(firstSaleVal);
      return `${formatBTCPrice(total, undefined, 4)} BTC`;
    }
    return null;
  }, [marketplaceData?.volume, firstSaleVal]);

  return (
    <div className={s.stats}>
      <div className={s.stats_item}>
        <Text size="12" fontWeight="medium">
          Items
        </Text>
        <Heading as="h6" fontWeight="medium">
          {project?.maxSupply}
        </Heading>
      </div>
      {!!marketplaceData?.listed &&
        marketplaceData?.listed > 1 &&
        project?.maxSupply && (
          <div className={s.stats_item}>
            <Text size="12" fontWeight="medium">
              Listed
            </Text>
            <Heading as="h6" fontWeight="medium">
              {Math.floor((marketplaceData?.listed / project?.maxSupply) * 100)}
              %
            </Heading>
          </div>
        )}
      {isRoyalty && (
        <div className={s.stats_item}>
          <Text size="12" fontWeight="medium">
            royalty
          </Text>
          <Heading as="h6" fontWeight="medium">
            {(project?.royalty || 0) / 100}%
          </Heading>
        </div>
      )}
      {!!project?.btcFloorPrice && (
        <div className={`${s.stats_item} ${s.stats_item__icon}`}>
          <Text size="12" fontWeight="medium">
            Floor Price
          </Text>
          <Heading className={s.stats_item_text} as="h6" fontWeight="medium">
            {/* <SvgInset
              size={24}
              svgUrl={`${CDN_URL}/icons/Frame%20427319538.svg`}
            />{' '} */}
            {formatBTCPrice(project?.btcFloorPrice)} BTC
          </Heading>
        </div>
      )}
      {/* {!!firstSaleVal?.amount && firstSaleVal.amount !== '0' && (
        <div className={`${s.stats_item} ${s.stats_item__icon}`}>
          <Text size="12" fontWeight="medium">
            1st sales
          </Text>
          <Heading className={s.stats_item_text} as="h6" fontWeight="medium">
            {formatBTCPrice(firstSaleVal?.amount, undefined, 4)} BTC
          </Heading>
        </div>
      )}
      {!!marketplaceData?.volume && (
        <div className={`${s.stats_item} ${s.stats_item__icon}`}>
          <Text size="12" fontWeight="medium">
            Volume
          </Text>
          <Heading className={s.stats_item_text} as="h6" fontWeight="medium">
            {formatBTCPrice(marketplaceData?.volume, undefined, 4)} BTC
          </Heading>
        </div>
      )} */}
      {!!totalSale && (
        <div className={`${s.stats_item} ${s.stats_item__icon}`}>
          <Text size="12" fontWeight="medium">
            Total sales
          </Text>
          <Heading className={s.stats_item_text} as="h6" fontWeight="medium">
            {totalSale}
          </Heading>
        </div>
      )}
    </div>
  );
};
