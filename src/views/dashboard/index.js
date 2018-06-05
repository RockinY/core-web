// @flow
import React from 'react'

type State = {
  isHovered: boolean,
  activeChannelObject: ?Object
}

type Props = {}

class Dashboard extends React.Component<Props, State> {
  render () {
    return (
      <div>This is dashboard</div>
    )
  }
}

export default Dashboard
