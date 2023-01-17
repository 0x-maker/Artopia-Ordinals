import s from '@containers/Display/components/hardware/hardware.module.scss';
import { BenchmarkItem } from '../benchmark-item';
import classNames from 'classnames';

export const Benchmark = (): JSX.Element => {
  return (
    <div className={classNames(s.hardWare_benchmark, 'container')}>
      <div className={`row ${s.hardWare_benchmark_header}`}>
        <div className="col-xl-6 offset-xl-3 col-md-10 offset-md-1 col-12">
          <h3 className={`heading heading__medium`}>Benchmark</h3>
          <p className={`desc__medium`}>
            Generative Display has set a rising standard in showcasing living
            art — with numbers that speak for themselves.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6 offset-xl-3 col-md-10 offset-md-1 col-12">
          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            title={'Cosmic Reef #242'}
            artLink={
              'https://generator.artblocks.io/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/250000242'
            }
            color={'dep-yellow'}
            artCreatorName={`Leo Villareal`}
            target1={{ title: 'Generative Display', value: 59 }}
            target2={{ title: 'Macbook Pro 16 2019', value: 14 }}
          />
          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            title={'Act of Emotion #200'}
            artLink={
              'https://generator.artblocks.io/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/364000200'
            }
            color={'dep-blue'}
            artCreatorName={`Kelly Milligan`}
            target1={{ title: 'Generative Display', value: 58 }}
            target2={{ title: 'Macbook Pro 16 2019', value: 12 }}
          />
          <BenchmarkItem
            className={s.hardWare_benchmark_item}
            color={'yellow'}
            title={'The Field #0'}
            artLink={`https://generator.artblocks.io/0x99a9b7c1116f9ceeb1652de04d5969cce509b069/399000000`}
            artCreatorName={`Beervangeer`}
            target1={{ title: 'Generative Display', value: 58.5 }}
            target2={{ title: 'Macbook Pro 16 2019', value: 6 }}
          />
        </div>
      </div>
    </div>
  );
};
