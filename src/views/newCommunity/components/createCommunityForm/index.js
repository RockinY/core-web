import React from 'react'
import Link from '../../../../components/link'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import slugg from 'slugg'
import { withApollo } from 'react-apollo'
import { Notice } from '../../../../components/listItems/style'
import Avatar from '../../../../components/avatar'
import { throttle } from '../../../../utils/utils'
import { addToastWithTimeout } from '../../../../actions/toasts'
import { COMMUNITY_SLUG_BLACKLIST } from '../../../../utils/slugBlacklists'
import createCommunityMutation from '../../../../graphql/mutations/community/createCommunity'
import type { CreateCommunityType } from '../../../../graphql/mutations/community/createCommunity'
import { getCommunityBySlugQuery } from '../../../../graphql/queries/community/getCommunity'
import { Button } from '../../../../components/buttons'
import {
  Input,
  UnderlineInput,
  TextArea,
  PhotoInput,
  CoverInput,
  Error,
  Checkbox
} from '../../../../components/formElements'
import {
  ImageInputWrapper,
  Spacer,
  CommunitySuggestionsWrapper,
  CommunitySuggestion,
  CommunitySuggestionsText,
  PrivacySelector,
  PrivacyOption,
  PrivacyOptionLabel,
  PrivacyOptionText
} from './style'
import { FormContainer, Form, Actions } from '../../style'
import type { Dispatch } from 'redux'

type State = {
  name: ?string,
  slug: string,
  description: string,
  website: string,
  image: string,
  coverPhoto: string,
  file: ?Object,
  coverFile: ?Object,
  slugTaken: boolean,
  slugError: boolean,
  descriptionError: boolean,
  nameError: boolean,
  createError: boolean,
  isLoading: boolean,
  agreeCoC: boolean,
  photoSizeError: boolean,
  communitySuggestions: ?Array<Object>,
  isPrivate: boolean
}

type Props = {
  client: Object,
  createCommunity: Function,
  communityCreated: Function,
  dispatch: Dispatch<Object>,
  name: string
}

class CreateCommunityForm extends React.Component<Props, State> {
  constructor (props) {
    super(props)
    this.state = {
      name: props.name || '',
      slug: '',
      description: '',
      website: '',
      image: '',
      coverPhoto: '',
      file: null,
      coverFile: null,
      slugTaken: false,
      slugError: false,
      descriptionError: false,
      nameError: false,
      createError: false,
      isLoading: false,
      agreeCoC: false,
      photoSizeError: false,
      communitySuggestions: null,
      isPrivate: false
    }

    this.checkSlug = throttle(this.checkSlug, 500)
  }

  changeName = e => {
    const { communitySuggestions } = this.state
    if (communitySuggestions) {
      this.setState({
        communitySuggestions: null
      })
    }

    const name = e.target.value
    let lowercaseName = name
      .toLowerCase()
      .trim()
    let slug = slugg(lowercaseName)

    if (name.length >= 20) {
      this.setState({
        nameError: true
      })
      return
    }

    if (COMMUNITY_SLUG_BLACKLIST.indexOf(slug) > -1) {
      this.setState({
        name,
        slug,
        slugTaken: true
      })
    } else {
      this.setState({
        name,
        slug,
        nameError: false,
        slugTaken: false
      })
    }

    this.checkSlug(slug)
  }

  changeSlug = e => {
    let slug = e.target.value
    let lowercaseSlug = slug
      .toLowerCase()
      .trim()
    slug = slugg(lowercaseSlug)

    if (slug.length >= 24) {
      this.setState({
        slug,
        slugError: true
      })
      return
    }

    if (COMMUNITY_SLUG_BLACKLIST.indexOf(slug) > -1) {
      this.setState({
        slug,
        slugTaken: true
      })
    } else {
      this.setState({
        slug,
        slugError: false,
        slugTaken: false
      })
      this.checkSlug(slug)
    }
  }

  checkSlug = slug => {
    this.props.client
      .query({
        query: getCommunityBySlugQuery,
        variables: {
          slug
        }
      })
      .then(({ data }) => {
        if (COMMUNITY_SLUG_BLACKLIST.indexOf(this.state.slug) > -1) {
          return this.setState({
            slugTaken: true
          })
        }

        if (!data.loading && data && data.community && data.community.id) {
          return this.setState({
            slugTaken: true
          })
        } else {
          return this.setState({
            slugTaken: false
          })
        }
      })
      .catch(err => {
        return this.props.dispatch(addToastWithTimeout('success', err.message))
      })
  }

  changeDescription = e => {
    const description = e.target.value
    if (description.length >= 140) {
      this.setState({
        descriptionError: true
      })
      return
    }

    this.setState({
      description,
      descriptionError: false
    })
  }

  changeWebsite = e => {
    const website = e.target.value
    this.setState({
      website
    })
  }

  changeCoC = () => {
    const value = this.state.agreeCoC
    this.setState({
      agreeCoC: !value
    })
  }

  setCommunityPhoto = e => {
    let reader = new FileReader()
    let file = e.target.files[0]

    if (file.size > 3000000) {
      return this.setState({
        photoSizeError: true
      })
    }

    reader.onloadend = () => {
      this.setState({
        file: file,
        image: reader.result,
        photoSizeError: false
      })
    }

    reader.readAsDataURL(file)
  }

  setCommunityCover = e => {
    let reader = new FileReader()
    let file = e.target.files[0]

    if (file.size > 3000000) {
      return this.setState({
        photoSizeError: true
      })
    }

    reader.onloadend = () => {
      this.setState({
        coverFile: file,
        coverPhoto: reader.result,
        photoSizeError: false
      })
    }

    reader.readAsDataURL(file)
  }

  create = e => {
    e.preventDefault()
    const {
      name,
      slug,
      description,
      website,
      file,
      coverFile,
      slugTaken,
      slugError,
      nameError,
      descriptionError,
      photoSizeError,
      agreeCoC,
      isPrivate
    } = this.state

    if (
      slugTaken ||
      nameError ||
      descriptionError ||
      slugError ||
      photoSizeError ||
      !name ||
      !slug ||
      !description ||
      !agreeCoC
    ) {
      this.setState({
        createError: true
      })
      return
    }

    this.setState({
      createError: false,
      isLoading: true
    })

    const input = {
      name,
      slug,
      description,
      website,
      file,
      coverFile,
      isPrivate
    }

    this.props
      .createCommunity(input)
      .then(({ data }: CreateCommunityType) => {
        const { createCommunity } = data
        this.props.communityCreated(createCommunity)
        this.props.dispatch(
          addToastWithTimeout('success', '社区已创建')
        )
      })
      .catch(err => {
        this.setState({
          isLoading: false
        })
        this.props.dispatch(addToastWithTimeout('error', err.message))
      })
  }

  setPrivate = () => {
    return this.setState({
      isPrivate: true
    })
  }

  setPublic = () => {
    return this.setState({
      isPrivate: false
    })
  }

  render () {
    const {
      name,
      slug,
      description,
      image,
      coverPhoto,
      website,
      slugTaken,
      slugError,
      nameError,
      descriptionError,
      createError,
      isLoading,
      agreeCoC,
      photoSizeError,
      communitySuggestions,
      isPrivate
    } = this.state

    const suggestionString = slugTaken
      ? communitySuggestions && communitySuggestions.length > 0
        ? '你寻找的社区是下面社区里面的一个吗?'
        : null
      : `社区名和链接是有效的，只是我们也发现了一些类似的社区，也许你可以尝试加入他们而不是创建一个新的社区!`

    return (
      <FormContainer data-cy='create-community-form'>
        <Form>
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
              user={null}
              community
              allowGif
            />
          </ImageInputWrapper>

          {photoSizeError && (
            <Notice style={{ marginTop: '32px' }}>
              上传的图片不得大于3MB
            </Notice>
          )}

          <Spacer height={8} />

          <Input
            defaultValue={name}
            onChange={this.changeName}
            autoFocus={!window.innerWidth < 768}
            dataCy='community-name-input'
          >
            我该怎么称呼你的社区呢?
          </Input>

          {nameError && (
            <Error>社区名字不应该超过20个字符.</Error>
          )}

          <UnderlineInput
            defaultValue={slug}
            onChange={this.changeSlug}
            dataCy='community-slug-input'
          >
            {process.env.REACT_APP_CLIENT_URL}/
          </UnderlineInput>

          {slugTaken && (
            <Error>
              这个链接已经被使用了，尝试换一个吧!
            </Error>
          )}

          {slugError && <Error>链接最多不能超过24个字母.</Error>}

          {suggestionString &&
            !nameError &&
            !slugError &&
            communitySuggestions &&
            communitySuggestions.length > 0 && (
              <CommunitySuggestionsText>
                {suggestionString}
              </CommunitySuggestionsText>
            )}

          <CommunitySuggestionsWrapper>
            {!nameError &&
              !slugError &&
              communitySuggestions &&
              communitySuggestions.length > 0 &&
              communitySuggestions.map(suggestion => {
                return (
                  <Link to={`/${suggestion.slug}`} key={suggestion.id}>
                    <CommunitySuggestion>
                      <Avatar
                        size={'20'}
                        radius={4}
                        community={suggestion}
                        src={suggestion.profilePhoto}
                      />
                      <strong>{suggestion.name}</strong>{' '}
                      {suggestion.metaData.members.toLocaleString()} 成员
                    </CommunitySuggestion>
                  </Link>
                )
              })}
          </CommunitySuggestionsWrapper>

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
            dataCy='community-description-input'
          >
            请用少于140个字符的内容描述它
          </TextArea>

          {descriptionError && (
            <Error>
              描述有点过长超过140个字符了，尝试对它进行一点精简吧.
            </Error>
          )}

          <Input
            defaultValue={website}
            onChange={this.changeWebsite}
            dataCy='community-website-input'
          >
            可选: 给社区添加一个网址
          </Input>

          <PrivacySelector>
            <PrivacyOption selected={!isPrivate} onClick={this.setPublic}>
              <PrivacyOptionLabel>
                <input
                  type='radio'
                  value='public'
                  checked={!isPrivate}
                  onChange={this.setPublic}
                  data-cy='community-public-selector-input'
                />
                公共
              </PrivacyOptionLabel>
              <PrivacyOptionText>
                任何人都可以加入和浏览其中的对话. 公共社区可以被直接搜索到, 同时公共社区
                会出现在非会员的建议选项中. 同时社区里的对象也可以被直接搜索.
              </PrivacyOptionText>
            </PrivacyOption>

            <PrivacyOption selected={isPrivate} onClick={this.setPrivate}>
              <PrivacyOptionLabel>
                <input
                  type='radio'
                  checked={isPrivate}
                  value='private'
                  onChange={this.setPrivate}
                  data-cy='community-private-selector-input'
                />
                私有
              </PrivacyOptionLabel>
              <PrivacyOptionText>
                社区的会员必须经过管理员审核才能浏览社区内容，或者进行社区内对话.
                私有社区无法被直接搜索或被推荐给其他人员. 对话的内容也无法被直接搜索.
              </PrivacyOptionText>
            </PrivacyOption>
          </PrivacySelector>

          <Checkbox
            id='isPrivate'
            checked={agreeCoC}
            onChange={this.changeCoC}
            dataCy='community-coc-input'
          >
            <span>
              我已经阅读{' '}
              <a
                href='https://github.com/withspectrum/code-of-conduct'
                target='_blank'
                rel='noopener noreferrer'
              >
                云社使用协议
              </a>{' '}
              并且同意该协议且会应用在社区的日常管理中.
            </span>
          </Checkbox>

          {createError && (
            <Error>
              创建该社区之前请先修复错误提示
            </Error>
          )}
        </Form>

        <Actions>
          <div />
          <Button
            onClick={this.create}
            disabled={
              slugTaken ||
              slugError ||
              nameError ||
              createError ||
              descriptionError ||
              !name ||
              !description ||
              !agreeCoC
            }
            loading={isLoading}
            dataCy='community-create-button'
          >
            创建社区 & 继续
          </Button>
        </Actions>
      </FormContainer>
    )
  }
}

export default compose(
  createCommunityMutation,
  withRouter,
  connect(),
  withApollo
)(CreateCommunityForm)
