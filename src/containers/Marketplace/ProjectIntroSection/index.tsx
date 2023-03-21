import LayoutForMinting from '@containers/Marketplace/ProjectIntroSection/LayoutForMinting';
import {
  ProjectLayoutContext,
  ProjectLayoutProvider,
} from '@contexts/project-layout-context';
import { PaymentMethod } from '@enums/mint-generative';
import { IProjectMintFeeRate } from '@interfaces/api/project';
import { Project } from '@interfaces/project';
import { useContext, useMemo } from 'react';
import LayoutForMintout from './LayoutForMintout';
import s from './styles.module.scss';
import { useRouter } from 'next/router';

type Props = {
  project?: Project | null;
  projectFeeRate?: IProjectMintFeeRate | null;
  openMintBTCModal: (s: PaymentMethod) => void;
  isWhitelist?: boolean;
};

const ProjectIntroSection = () => {
  const router = useRouter();
  const { query } = router;

  const { isLimitMinted } = useContext(ProjectLayoutContext);

  const isProMode = useMemo(() => query?.mode === 'pro', [query]);

  return (
    <div className={`${s.wrapper} ${!isLimitMinted ? `${s.minted}` : ''}`}>
      <div className={'container'}>
        {isProMode ? <LayoutForMintout /> : <LayoutForMinting />}
      </div>
    </div>
  );
};

const ProjectIntroSectionWrap = ({
  project,
  projectFeeRate,
  openMintBTCModal,
  isWhitelist = false,
}: Props): JSX.Element => {
  return (
    <ProjectLayoutProvider
      project={project}
      projectFeeRate={projectFeeRate}
      openMintBTCModal={openMintBTCModal}
      isWhitelist={isWhitelist}
    >
      <ProjectIntroSection />
    </ProjectLayoutProvider>
  );
};

export default ProjectIntroSectionWrap;
