import db from './db'

type DBUser = {
  id: string,
  email?: string,
  createdAt: Date,
  name: string,
  coverPhoto: string,
  profilePhoto: string,
  providerId?: ?string,
  githubProviderId?: ?string,
  githubUsername?: ?string,
  username: ?string,
  timezone?: ?number,
  isOnline?: boolean,
  lastSeen?: ?Date,
  description?: ?string,
  website?: ?string,
  modifiedAt: ?Date,
  bannedAt: ?Date
}

type GetUserInput = {
  id?: string,
  username?: string
}

export const getUser = async (input: GetUserInput): Promise<?DBUser> => {
  if (input.id) {
    const user = await getUserById(input.id)
    return user
  }
  if (input.username) {
    const user = await getUserByUsername(input.username)
    return user
  }
  return null
}

export const getUserById = (userId: string): Promise<DBUser> => {
  return db
    .table('users')
    .get(userId)
    .run()
}