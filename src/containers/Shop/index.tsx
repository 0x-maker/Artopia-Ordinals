import s from './styles.module.scss';
import { ShopTab } from '@enums/shop';
import React, { useEffect, useMemo, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Collection from './Collection';
import { CDN_URL } from '@constants/config';
import ListCollectionModal from './ListCollectionModal';
import Items from './Items';
import SvgInset from '@components/SvgInset';
import cs from 'classnames';
import { useRouter } from 'next/router';
import { LocalStorageKey } from '@enums/local-storage';
import Heading from '@components/Heading';
import ButtonIcon from '@components/ButtonIcon';

const ShopController: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ShopTab>(ShopTab.COLLECTION);
  const [showListCollectionModal, setShowListCollectionModal] = useState(false);

  const handleSelectTab = (tab: ShopTab): void => {
    setActiveTab(tab);
    sessionStorage.setItem(LocalStorageKey.SHOP_ACTIVE_TAB, tab);
    router.replace({
      query: { ...router.query, tab: tab },
    });
  };

  const handleOpenListCollectionModal = (): void => {
    setShowListCollectionModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseListCollectionModal = (): void => {
    setShowListCollectionModal(false);
    document.body.style.overflow = 'auto';
  };

  const renderCollectionsTitle = useMemo(
    (): React.ReactElement => (
      <div className={s.tabTitle}>
        <SvgInset
          className={s.tabIcon}
          svgUrl={`${CDN_URL}/icons/ic-collection-18x18.svg`}
          size={18}
        />
        <h2 className={s.tabName}>Collections</h2>
      </div>
    ),
    []
  );

  const renderItemsTitle = useMemo(
    (): React.ReactElement => (
      <div className={s.tabTitle}>
        <SvgInset
          className={cs(s.tabIcon, s.tabItemIcon)}
          svgUrl={`${CDN_URL}/icons/ic-items-18x18.svg`}
          size={18}
        />
        <h2 className={s.tabName}>Items</h2>
      </div>
    ),
    []
  );

  useEffect(() => {
    const query = router.query as { tab: string };
    let tabName: string = query.tab;
    // Use query first
    if (!tabName) {
      tabName = sessionStorage.getItem(LocalStorageKey.SHOP_ACTIVE_TAB) || '';
    }

    if (Object.values(ShopTab).includes(tabName as ShopTab)) {
      handleSelectTab(tabName as ShopTab);
    }
  }, []);

  return (
    <>
      <div className={s.shopController}>
        <div className="container">
          <div className={s.headingWrapper}>
            <Heading className={s.heading} as={'h1'} color={'white'}>
              Buy art on Bitcoin. Simple. Fast. Zero fees.
            </Heading>
            <div className={s.actionWrapper}>
              <ButtonIcon
                variants={'blue-deep'}
                startIcon={
                  <SvgInset
                    svgUrl={`${CDN_URL}/icons/ic-image-white-18x18.svg`}
                  />
                }
                onClick={handleOpenListCollectionModal}
              >
                List a collection
              </ButtonIcon>
            </div>
          </div>
          <Tabs
            className={s.tabs}
            activeKey={activeTab}
            onSelect={tab => handleSelectTab(tab as ShopTab)}
          >
            <Tab
              tabClassName={s.tab}
              eventKey={ShopTab.COLLECTION}
              title={renderCollectionsTitle}
            >
              <div className={s.collectionTab}>
                <Collection />
              </div>
            </Tab>

            <Tab
              tabClassName={s.tab}
              eventKey={ShopTab.ITEMS}
              title={renderItemsTitle}
            >
              <div className={s.collectionTab}>
                <Items />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      {showListCollectionModal && (
        <ListCollectionModal handleClose={handleCloseListCollectionModal} />
      )}
    </>
  );
};

export default ShopController;
