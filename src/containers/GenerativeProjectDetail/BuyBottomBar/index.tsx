import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import React, { useContext } from 'react';
import { Range, getTrackBackground } from 'react-range';
import s from './styles.module.scss';
import ButtonSweepBTC from '@components/Transactor/ButtonSweepBTC';
import ButtonSweepETH from '@components/Transactor/ButtonSweepETH';

const MIN = 0;
const MAX = 30;

const BuyBottomBar: React.FC = (): React.ReactElement => {
  const { listItems, listItemsBuyable, selectedOrders, selectOrders } =
    useContext(GenerativeProjectDetailContext);

  const max = listItemsBuyable?.length || MAX;

  const changeRange = (values: number[]) => {
    if (values.length > 0) {
      const value = Math.max(MIN, Math.min(max, values[0]));
      selectOrders(value);
    }
  };

  const changeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(MIN, Math.min(max, Number(event.target.value)));
    selectOrders(value);
  };

  const selectedItems = listItems
    ? listItems.filter(item => selectedOrders.includes(item.orderID))
    : [];

  return (
    <div className={s.container}>
      <div className={s.leftContainer}>
        <ButtonSweepBTC tokens={selectedItems} />
        <ButtonSweepETH tokens={selectedItems} className={s.wrapButton} />
      </div>
      <div className={s.rightContainer}>
        <input
          className={s.input}
          onChange={changeWidth}
          placeholder="0"
          min={MIN}
          max={max}
          value={selectedItems.length}
        />
        {listItemsBuyable?.length && (
          <Range
            onChange={changeRange}
            min={MIN}
            max={max}
            step={1}
            values={[selectedItems.length]}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  background: getTrackBackground({
                    values: [selectedItems.length],
                    colors: ['#4F43E2', '#C6C7F8'],
                    min: MIN,
                    max: max,
                  }),
                }}
                className={s.track}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => <div {...props} className={s.thumb} />}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(BuyBottomBar);
