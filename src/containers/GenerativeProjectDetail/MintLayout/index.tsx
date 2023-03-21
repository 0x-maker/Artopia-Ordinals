import CollectionList from '@components/Collection/List';
import { TriggerLoad } from '@components/TriggerLoader';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import cs from 'classnames';
import { useContext, useMemo } from 'react';
import TokenTopFilter from '../TokenTopFilter';
import styles from '../styles.module.scss';

const MintLayout = () => {
  const {
    projectData: projectInfo,
    marketplaceData,
    listItems,
    isLoaded,
    total,
    isNextPageLoaded,
    handleFetchNextPage,
  } = useContext(GenerativeProjectDetailContext);

  const hasFilter = useMemo(() => {
    if (
      (projectInfo?.traitStat && projectInfo.traitStat.length > 0) ||
      (marketplaceData && marketplaceData?.listed > 0)
    ) {
      return true;
    } else return false;
  }, [projectInfo?.traitStat, marketplaceData?.listed]);

  return (
    // <Tabs className={styles.tabs} defaultActiveKey="outputs">
    <div>
      {hasFilter && (
        <div className={cs(styles.filterWrapper)} id="PROJECT_LIST">
          <TokenTopFilter className={styles.filter_sort} />
        </div>
      )}
      <div className={styles.tokenListWrapper} id="PROJECT_LIST">
        <div className={styles.tokenList}>
          <CollectionList
            projectInfo={projectInfo}
            listData={listItems}
            isLoaded={isLoaded}
            layout="mint"
          />
          <TriggerLoad
            len={listItems?.length || 0}
            total={total || 0}
            isLoaded={isNextPageLoaded}
            onEnter={handleFetchNextPage}
          />
        </div>
      </div>
    </div>
    // </Tabs>
  );
};

export default MintLayout;
