import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import cs from 'classnames';
import Heading from '@components/Heading';
import { filterCreatorName } from '@utils/generative';
import { SocialVerify } from '@components/SocialVerify';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { IC_EDIT_PROJECT } from '@constants/icons';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { checkForHttpRegex } from '@utils/string';
import { formatWebDomain } from '@utils/format';
import { useContext } from 'react';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { useRouter } from 'next/router';
import { Stack } from 'react-bootstrap';
import { URL_PARAMS_PRO_MODE } from '@constants/common';

export const ProjectName = (): JSX.Element => {
  const router = useRouter();

  const { projectID } = router.query;

  const {
    project,
    isHasBtcWallet,
    creatorAddress,
    isTwVerified,
    isCreated,
    projectName,
    isEdit,
  } = useContext(ProjectLayoutContext);
  return (
    <>
      <div className={`${s.projectHeader}`}>
        <Stack direction="horizontal" className="justify-between w-full">
          <Stack direction="horizontal" gap={3}>
            {isHasBtcWallet ? (
              <Link
                href={`${ROUTE_PATH.PROFILE}/${creatorAddress}`}
                className={cs(
                  s.creator_info,
                  !project?.creatorProfile?.walletAddressBtcTaproot &&
                    !project?.creatorProfile?.walletAddress &&
                    'pointer-none'
                )}
              >
                <Heading
                  className={s.projectHeader_creator}
                  as="h4"
                  fontWeight="medium"
                >
                  {project && filterCreatorName(project)}
                </Heading>
              </Link>
            ) : (
              <div
                className={cs(
                  s.creator_info,
                  !project?.creatorProfile?.walletAddressBtcTaproot &&
                    'pointer-none'
                )}
              >
                <Heading
                  className={s.projectHeader_creator}
                  as="h4"
                  fontWeight="medium"
                >
                  {project && filterCreatorName(project)}
                </Heading>
              </div>
            )}
            <SocialVerify isTwVerified={isTwVerified} />
          </Stack>
          <ButtonIcon
            sizes="small"
            variants={'ghost'}
            onClick={() => {
              router.push(
                `${ROUTE_PATH.GENERATIVE}/${projectID}${URL_PARAMS_PRO_MODE}`
              );
            }}
            endIcon={
              <SvgInset
                size={10}
                svgUrl={`${CDN_URL}/icons/ic-angle-right.svg`}
              />
            }
          >
            Open Pro View
          </ButtonIcon>
        </Stack>
      </div>
      <div
        className={`${s.projectHeader_heading} ${isCreated ? s.hasEdit : ''}`}
      >
        <Heading className={s.projectHeader_title} as="h4" fontWeight="medium">
          {projectName}
        </Heading>
        {isEdit && (
          <div className={s.projectHeader_btn}>
            <ButtonIcon
              sizes="xsmall"
              variants={'outline'}
              endIcon={<SvgInset svgUrl={IC_EDIT_PROJECT} />}
              onClick={() =>
                router.push(`${ROUTE_PATH.GENERATIVE_EDIT}/${project?.tokenID}`)
              }
            >
              <Text fontWeight="medium" as="span">
                Edit
              </Text>
            </ButtonIcon>
          </div>
        )}
      </div>
      <div className={s.creator_social}>
        {project?.creatorProfile?.profileSocial?.twitter && (
          <div className={`${s.creator_social_item}`}>
            <div className={s.creator_social_item_inner}>
              <SvgInset
                className={`${s.creator_social_twitter}`}
                size={24}
                svgUrl={`${CDN_URL}/icons/Twitter.svg`}
              />
              <Text size={'18'}>
                <Link
                  href={project?.creatorProfile?.profileSocial?.twitter || ''}
                  target="_blank"
                >
                  {project?.creatorProfile?.profileSocial?.twitter
                    .split('/')
                    .pop()}
                </Link>
              </Text>
            </div>
          </div>
        )}
        {project?.creatorProfile?.profileSocial?.web && (
          <>
            <span className={s.creator_divider} />
            <div className={`${s.creator_social_item}`}>
              <div className={s.creator_social_item_inner}>
                <SvgInset
                  // className={`${s.creator_social_twitter}`}
                  size={24}
                  svgUrl={`${CDN_URL}/icons/link-copy.svg`}
                />
                <Text size={'18'}>
                  {checkForHttpRegex(
                    project?.creatorProfile?.profileSocial?.web
                  ) ? (
                    <Link
                      href={project?.creatorProfile?.profileSocial?.web || ''}
                      target="_blank"
                    >
                      {formatWebDomain(
                        project?.creatorProfile?.profileSocial?.web || ''
                      )}
                    </Link>
                  ) : (
                    project?.creatorProfile?.profileSocial?.web
                  )}
                </Text>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
