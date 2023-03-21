/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useAppSelector } from '@redux';
import cn from 'classnames';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';
import _isEmpty from 'lodash/isEmpty';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import { Loading } from '@components/Loading';
import { Empty } from '@components/Collection/Empty';
import ButtonIcon from '@components/ButtonIcon';
import BaseModal from '@components/Transactor';
import Input from '@components/Formik/Input';
import { ErrorMessage } from '@enums/error-message';
import Button from '@components/Button';
import { WalletContext } from '@contexts/wallet-context';
import { getUserSelector } from '@redux/user/selector';
import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';
import { DAO_TYPE } from '@constants/dao';
import {
  createDaoArtist,
  getDaoProjectsIsHidden,
  createDaoProjects,
} from '@services/request';
import { IDaoProject } from '@interfaces/api/request';
import { convertIpfsToHttp } from '@utils/image';

import s from './SubmitDaoButton.module.scss';

interface SubmitDaoButtonProps {
  className?: string;
  currentTabActive: number;
}

const LOG_PREFIX = 'DAOPage';

const SubmitCollection = ({
  user,
  isConnecting,
}: {
  user: any;
  isConnecting: boolean;
}): JSX.Element => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [listCollectionsIsHidden, setListCollectionsIsHidden] = useState<
    IDaoProject[]
  >([]);
  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    if (isShowModal) {
      (async () => {
        const { result } = await getDaoProjectsIsHidden({ limit: 100 });
        setListCollectionsIsHidden(result || []);
        setIsLoaded(true);
      })();
    }
  }, [user, isShowModal]);

  useEffect(() => {
    if (isShowModal === false) {
      setIsLoaded(false);
    }
  }, [isShowModal]);

  const validateForm = ({ checked }: { checked: Record<string, string>[] }) => {
    const errors: Record<string, string> = {};
    if (checked?.length < 1) {
      errors.checked = 'No checkbox checked.';
    }

    return errors;
  };
  const handleSubmit = async ({ checked }: { checked: Array<string> }) => {
    toast.remove();
    try {
      const result = await createDaoProjects({
        project_ids: checked,
      });
      if (result) {
        toast.success('Submit proposal successfully.');
        router.replace({
          query: {
            tab,
          },
        });
      } else {
        toast.error(ErrorMessage.DEFAULT);
      }
    } catch (error) {
      toast.error((error as { message: string })?.message);
    }
    setIsShowModal(false);
  };

  return (
    <>
      <div className={s.submitDaoButton_text}>
        {user
          ? 'It’s free and simple to release art on Bitcoin.'
          : 'Connect wallet to submit a collection.'}
      </div>
      <Button
        className={s.submitDaoButton_btn}
        onClick={() => setIsShowModal(true)}
        disabled={!user}
      >
        {isConnecting ? 'Connecting...' : 'Submit a collection'}
      </Button>
      <BaseModal
        className={s.submitDaoButton_modal}
        isShow={isShowModal}
        onHide={() => setIsShowModal(false)}
        title="Submit a collection"
      >
        <Formik
          initialValues={{
            checked: [],
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
          validateOnChange
        >
          {({ handleSubmit, isSubmitting, dirty, errors, values }) => (
            <Form>
              <div
                className={s.submitDaoButton_list}
                role="group"
                aria-labelledby="checkbox-group"
              >
                {isLoaded === false && (
                  <div className={s.submitDaoButton_loadingWrapper}>
                    <Loading isLoaded={false} />
                  </div>
                )}
                {isLoaded && listCollectionsIsHidden?.length < 1 ? (
                  <Empty content="No Data Available." />
                ) : (
                  <>
                    {listCollectionsIsHidden?.map(item => (
                      <label
                        className={s.submitDaoButton_collection}
                        key={item.id}
                      >
                        <div>
                          <div className="d-flex align-items-center">
                            <Image
                              className={s.users_avatar}
                              src={convertIpfsToHttp(item?.thumbnail)}
                              width={48}
                              height={48}
                              alt={item?.name}
                            />
                            <div className={s.submitDaoButton_collection_info}>
                              <div>{item?.name}</div>
                              <div
                                className={s.submitDaoButton_collection_output}
                              >
                                {item?.max_supply} outputs
                              </div>
                              <div>
                                <span
                                  className={
                                    s.submitDaoButton_collection_createdDate
                                  }
                                >
                                  Created date:{' '}
                                </span>
                                <span
                                  className={s.submitDaoButton_collection_date}
                                >
                                  {dayjs(item?.created_at).format(
                                    'MMM DD, YYYY'
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="position-relative">
                          <div
                            className={s.submitDaoButton_collection_checkbox}
                          >
                            <Field
                              type="checkbox"
                              name="checked"
                              value={item.id}
                            />
                            <span
                              className={cn(
                                s.submitDaoButton_collection_checkbox_checkmark,
                                values?.checked?.indexOf(item.id as never) !==
                                  -1 &&
                                  s.submitDaoButton_collection_checkbox_checked
                              )}
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </>
                )}
              </div>
              <div className={s.submitDaoButton_hr} />
              <ButtonIcon
                className={s.submitDaoButton_collectionBtn}
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !dirty || !_isEmpty(errors)}
              >
                Submit
              </ButtonIcon>
            </Form>
          )}
        </Formik>
      </BaseModal>
    </>
  );
};

const SubmitArtist = ({
  user,
  isConnecting,
  submitVerifyMe,
  isClickedVerify,
}: {
  user: any;
  isConnecting: boolean;
  submitVerifyMe: (...args: any) => any;
  isClickedVerify: boolean;
}) => {
  const router = useRouter();
  const { tab } = router.query;

  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const validateForm = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    const twitterRegex = /^https?:\/\/twitter\.com\/[A-Za-z0-9_]{1,15}\/?$/;
    const httpsRegex = /^(http|https):\/\//;

    if (values.twitter !== '' && !twitterRegex.test(values.twitter)) {
      errors.twitter = 'Invalid twitter link.';
    }

    if (!httpsRegex.test(values.website) && values.website !== '') {
      errors.website = 'Invalid website link.';
    }

    return errors;
  };
  const handleSubmit = async (values: Record<string, string>) => {
    submitVerifyMe({
      ...values,
      callback: () => {
        setIsShowModal(false);
        router.replace({
          query: {
            tab,
          },
        });
      },
    });
  };

  return (
    <>
      <div className={s.submitDaoButton_text}>
        {user
          ? 'Became a Generative artist and sharing your art.'
          : 'Connect wallet and became Generative artist.'}
      </div>
      <Button
        className={s.submitDaoButton_btn}
        onClick={() => setIsShowModal(true)}
        disabled={
          user === null || isClickedVerify || user?.canCreateProposal === false
        }
      >
        {isConnecting ? 'Connecting...' : 'Verify me'}
      </Button>
      <BaseModal
        className={s.submitDaoButton_modal}
        isShow={isShowModal}
        onHide={() => setIsShowModal(false)}
        title="Submit profile"
      >
        <>
          <div className={s.submitDaoButton_profileText}>
            Please input your twitter to create the proposal.
          </div>
          <Formik
            initialValues={{
              website: '',
              twitter: '',
            }}
            validate={validateForm}
            onSubmit={handleSubmit}
            validateOnChange
          >
            {({ handleSubmit, isSubmitting, dirty, errors }) => (
              <form>
                <Input
                  name="twitter"
                  label="twitter"
                  placeholder="https://twitter.com/..."
                  className={s.submitDaoButton_input}
                  errors={{ twitter: errors.twitter || '' }}
                  useFormik
                />
                <div className={s.submitDaoButton_mb24} />
                <Input
                  name="website"
                  label="website"
                  placeholder="https://"
                  className={s.submitDaoButton_input}
                  useFormik
                  errors={{ website: errors.website || '' }}
                />
                <div className={s.submitDaoButton_submitBtn}>
                  <ButtonIcon
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || !dirty || !_isEmpty(errors)}
                  >
                    Submit
                  </ButtonIcon>
                </div>
              </form>
            )}
          </Formik>
        </>
      </BaseModal>
    </>
  );
};

export const SubmitDaoButton = ({
  className,
  currentTabActive,
}: SubmitDaoButtonProps): JSX.Element => {
  const { connect } = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isClickedVerify, setIsClickedVerify] = useState<boolean>(false);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const submitVerifyMe = useCallback(
    async ({ twitter, website, callback }: any) => {
      if (user) {
        setIsConnecting(true);
        toast.remove();
        const result = await createDaoArtist(twitter, website);
        if (result) {
          toast.success('Submit proposal successfully.');
        } else {
          toast.error(ErrorMessage.DEFAULT);
        }
        setIsConnecting(false);
        setIsClickedVerify(true);
      } else {
        handleConnectWallet();
      }
      typeof callback === 'function' && callback();
    },
    [user]
  );

  if (
    currentTabActive === DAO_TYPE.ARTIST &&
    user?.profileSocial?.twitterVerified
  )
    return <></>;

  return (
    <div className={cn(s.submitDaoButton, className)}>
      {currentTabActive === DAO_TYPE.COLLECTION && (
        <SubmitCollection user={user} isConnecting={isConnecting} />
      )}
      {currentTabActive === DAO_TYPE.ARTIST && (
        <SubmitArtist
          user={user}
          isConnecting={isConnecting}
          submitVerifyMe={submitVerifyMe}
          isClickedVerify={isClickedVerify}
        />
      )}
    </div>
  );
};

export default React.memo(SubmitDaoButton);
