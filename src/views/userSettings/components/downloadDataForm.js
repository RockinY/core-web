// @flow
import * as React from 'react';
import styled from 'styled-components';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';

const Link = styled.a`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${props => props.theme.brand.default};
  padding: 12px 16px;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

type Props = {
  user: Object,
};

class DownloadDataForm extends React.Component<Props> {
  render() {
    const { user } = this.props;

    if (!user) return null;

    return (
      <SectionCard data-cy="download-data-container">
        <SectionTitle>下载我的数据</SectionTitle>
        <SectionSubtitle>
          你可以随时下载你的个人数据.
        </SectionSubtitle>

        <SectionCardFooter>
          <Link
            href={
              process.env.NODE_ENV === 'production'
                ? '/api/user.json'
                : 'http://localhost:3000/api/user.json'
            }
            download
          >
            下载我的数据
          </Link>
        </SectionCardFooter>
      </SectionCard>
    );
  }
}

export default DownloadDataForm;
