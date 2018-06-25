import React from 'react'
import Link from '../../../../components/link'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import slugg from 'slugg'
import { withApollo } from 'react-apollo'
import { Notice } from '../../../../components/listItems/style'
import Avatar from '../../../../components/avatar'
import { throttle } from '../../../../helpers/utils'
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
          addToastWithTimeout('success', 'Community created')
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
        ? 'Were you looking for one of these communities?'
        : null
      : "This community name and url are available! We also found communities that might be similar to what you're trying to create, just in case you would rather join an existing community instead!"

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
              Photo uploads should be less than 3mb
            </Notice>
          )}

          <Spacer height={8} />

          <Input
            defaultValue={name}
            onChange={this.changeName}
            autoFocus={!window.innerWidth < 768}
            dataCy='community-name-input'
          >
            What is your community called?
          </Input>

          {nameError && (
            <Error>Community names can be up to 20 characters long.</Error>
          )}

          <UnderlineInput
            defaultValue={slug}
            onChange={this.changeSlug}
            dataCy='community-slug-input'
          >
            spectrum.chat/
          </UnderlineInput>

          {slugTaken && (
            <Error>
              This url is already taken - feel free to change it if you’re set
              on the name {name}!
            </Error>
          )}

          {slugError && <Error>Slugs can be up to 24 characters long.</Error>}

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
                      {suggestion.metaData.members.toLocaleString()} members
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
            Describe it in 140 characters or less
          </TextArea>

          {descriptionError && (
            <Error>
              Oop, that’s more than 140 characters - try trimming that up.
            </Error>
          )}

          <Input
            defaultValue={website}
            onChange={this.changeWebsite}
            dataCy='community-website-input'
          >
            Optional: Add your community’s website
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
                Public
              </PrivacyOptionLabel>
              <PrivacyOptionText>
                Anyone can join and view conversations. Public communities will
                appear in search results, and can appear as suggested
                communities to non-members. Conversations will be search
                indexed.
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
                Private
              </PrivacyOptionLabel>
              <PrivacyOptionText>
                All members must be approved before they can view or join
                conversations. Private communities will not appear in search
                results or suggested communities. Conversations will not be
                search indexed.
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
              I have read the{' '}
              <a
                href='https://github.com/withspectrum/code-of-conduct'
                target='_blank'
                rel='noopener noreferrer'
              >
                Spectrum Code of Conduct
              </a>{' '}
              and agree to enforce it in my community.
            </span>
          </Checkbox>

          {createError && (
            <Error>
              Please fix any errors above before creating this community.
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
            Create Community & Continue
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
