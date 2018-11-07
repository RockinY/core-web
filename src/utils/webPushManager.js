function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

class WebPushManager {
  manager: any;
  subscriptionAttempt: boolean;

  constructor () {
    this.manager = null
    this.subscriptionAttempt = false
  }

  set = manager => {
    this.manager = manager
    if (this.subscriptionAttempt) {
      this.subscribe()
    } else if (this.unsubscriptionAttempt) {
      this.unsubscribe()
    }
  };

  subscribe = () => {
    if (!this.manager) {
      this.subscriptionAttempt = true
      return Promise.reject('Please try again.')
    }
    return this.manager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        'BO-87PxO0cpSrnWode3zSPK6xYU1AstUNO_A1UQzbWqcxTsJQtkM5mZQmyt7HRwVsO_VgDtReUDI4Bn2weuQWi4'
      )
    })
  };

  unsubscribe = () => {
    if (!this.manager) {
      this.unsubscriptionAttempt = true
      return Promise.resolve(true)
    }
    return this.getSubscription().then(subscription =>
      subscription.unsubscribe()
    )
  };

  getPermissionState = () => {
    // No compat
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return new Promise(resolve => {
        resolve(false)
      })
    }
    // Old API
    if (navigator.permissions) {
      return navigator.permissions
        .query({ name: 'notifications' })
        .then(result => result.state)
    }
    // New API
    return new Promise(resolve => {
      resolve(Notification.permission)
    })
  }

  _getSubscription = () => {
    return this.manager.getSubscription()
  }

  getSubscription = () =>
    new Promise(resolve => {
      // Recursively call this method until we got a manager
      if (!this.manager) {
        setTimeout(() => {
          resolve(this.getSubscription())
        }, 500)
      } else {
        resolve(this._getSubscription())
      }
    })
}

export default new WebPushManager()
