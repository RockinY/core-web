// @flow
import * as React from 'react'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import editCommunityMutation from '../../../../graphql/mutations/community/editCommunity'
import deleteCommunityMutation from '../../../../graphql/mutations/community/deleteCommunity'
import type { GetCommunityType } from '../../../../graphql/queries/community/getCommunity'
import { addToastWithTimeout } from '../../../../actions/toasts'
import { Button } from '../../../../components/buttons'
import { Notice } from '../../../../components/listItems/style'
import {
  Input,
  UnderlineInput,
  TextArea,
  PhotoInput,
  CoverInput,
  Error
} from '../../../../components/formElements'
import { ImageInputWrapper } from '../../../../components/editForm/style'
import { Actions, FormContainer, Form } from '../../style'
import type { Dispatch } from 'redux'

type State = {
  name: string,
  slug: string,
  description: string,
  communityId: string,
  website: string,
  image: string,
  coverPhoto: string,
  file: ?Object,
  coverFile: ?Object,
  communityData: Object,
  photoSizeError: boolean,
  nameError: boolean,
  isLoading: boolean,
};

type Props = {
  community: GetCommunityType,
  dispatch: Dispatch<Object>,
  communityUpdated: Function,
  editCommunity: Function,
};

class CommunityWithData extends React.Component<Props, State> {
  constructor (props) {
    super(props)

    const { community } = this.props
    this.state = {
      name: community.name,
      slug: community.slug,
      description: community.description ? community.description : '',
      communityId: community.id,
      website: community.website ? community.website : '',
      image: community.profilePhoto,
      coverPhoto: community.coverPhoto,
      file: null,
      coverFile: null,
      communityData: community,
      photoSizeError: false,
      nameError: false,
      isLoading: false
    }
  }

  changeName = e => {
    const name = e.target.value

    if (name.length >= 20) {
      this.setState({
        name,
        nameError: true
      })

      return
    }

    this.setState({
      name,
      nameError: false
    })
  };

  changeDescription = e => {
    const description = e.target.value
    this.setState({
      description
    })
  };

  changeSlug = e => {
    const slug = e.target.value
    this.setState({
      slug
    })
  };

  changeWebsite = e => {
    const website = e.target.value
    this.setState({
      website
    })
  };

  setCommunityPhoto = e => {
    let reader = new FileReader()
    let file = e.target.files[0]

    if (!file) return

    this.setState({
      isLoading: true
    })

    if (file && file.size > 3000000) {
      return this.setState({
        photoSizeError: true,
        isLoading: false
      })
    }

    reader.onloadend = () => {
      this.setState({
        file: file,
        // $FlowFixMe
        image: reader.result,
        photoSizeError: false,
        isLoading: false
      })
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  };

  setCommunityCover = e => {
    let reader = new FileReader()
    let file = e.target.files[0]

    if (!file) return

    this.setState({
      isLoading: true
    })

    if (file && file.size > 3000000) {
      return this.setState({
        photoSizeError: true,
        isLoading: false
      })
    }

    reader.onloadend = () => {
      this.setState({
        coverFile: file,
        // $FlowFixMe
        coverPhoto: reader.result,
        photoSizeError: false,
        isLoading: false
      })
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  };

  save = e => {
    e.preventDefault()
    const {
      name,
      description,
      website,
      file,
      coverFile,
      communityId,
      photoSizeError
    } = this.state
    const input = {
      name,
      description,
      website,
      file,
      coverFile,
      communityId
    }

    if (photoSizeError) {
      return
    }

    this.setState({
      isLoading: true
    })

    this.props
      .editCommunity(input)
      .then(({ data: { editCommunity } }) => {
        const community = editCommunity

        this.setState({
          isLoading: false
        })

        // community was returned
        if (community !== undefined) {
          this.props.dispatch(
            addToastWithTimeout('success', '社区已保存!')
          )
          this.props.communityUpdated(community)
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        })

        this.props.dispatch(
          addToastWithTimeout(
            'error',
            `出错了，无法保存社区. ${err}`
          )
        )
      })
  };

  render () {
    const {
      name,
      slug,
      description,
      image,
      coverPhoto,
      website,
      photoSizeError,
      nameError,
      isLoading
    } = this.state

    return (
      <FormContainer>
        <Form onSubmit={this.save}>
          <ImageInputWrapper>
            <CoverInput
              onChange={this.setCommunityCover}
              defaultValue={coverPhoto}
              preview
              allowGif
            />

            <PhotoInput
              onChange={this.setCommunityPhoto}
              defaultValue={image}
              allowGif
            />
          </ImageInputWrapper>

          <Input defaultValue={name} onChange={this.changeName}>
            名字
          </Input>
          <UnderlineInput defaultValue={slug} disabled>
            {process.env.REACT_APP_CLIENT_URL}/
          </UnderlineInput>

          {nameError && (
            <Error>社区名字不应该超过20个字符..</Error>
          )}

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
          >
            描述
          </TextArea>

          <Input
            defaultValue={website}
            onChange={this.changeWebsite}
            autoFocus
          >
            可选: 给社区添加一个网址
          </Input>

          {photoSizeError && (
            <Notice style={{ marginTop: '16px' }}>
              上传的图片应该不超过3MB
            </Notice>
          )}
        </Form>

        <Actions>
          <div />
          <Button
            loading={isLoading}
            onClick={this.save}
            disabled={photoSizeError}
          >
            保持 & 继续
          </Button>
        </Actions>
      </FormContainer>
    )
  }
}

const Community = compose(
  deleteCommunityMutation,
  // $FlowFixMe
  editCommunityMutation,
  // $FlowFixMe
  withRouter,
  connect()
)(CommunityWithData)
export default Community
