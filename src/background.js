/* global chrome, alert, prompt, confirm */

const GITHUB_TOKEN_KEY = 'x-github-token'
const TOKEN_FEATURE_INFORMATION_KEY = 'user-knows-token-feature'

function setGithubToken (key, cb) {
  const obj = {}
  obj[GITHUB_TOKEN_KEY] = key

  chrome.storage.sync.set(obj, function () {
    alert('Your Github token has been set successfully. Reload the Github page to see changes.')

    cb()
  })
}

function handleOldGithubToken (cb) {
  chrome.storage.sync.get(GITHUB_TOKEN_KEY, function (storedData) {
    const oldGithubToken = storedData[GITHUB_TOKEN_KEY]

    if (oldGithubToken) {
      if (confirm('You have already set your Github token. Do you want to remove it?')) {
        chrome.storage.sync.remove(GITHUB_TOKEN_KEY, function () {
          alert('You have successfully removed Github token. Click extension icon again to set a new token.')

          cb(false)
        })
      } else {
        cb(false)
      }
    } else {
      cb(true)
    }
  })
}

function userNowKnowsAboutGithubTokenFeature (cb) {
  const obj = {}
  obj[TOKEN_FEATURE_INFORMATION_KEY] = true

  chrome.storage.sync.set(obj, cb)
}

function informUserAboutGithubTokenFeature () {
  chrome.storage.sync.get(TOKEN_FEATURE_INFORMATION_KEY, function (storedData) {
    const userKnows = storedData[TOKEN_FEATURE_INFORMATION_KEY]

    if (!userKnows) {
      if (confirm('GitHub Repository Size now supports private repositories through Github personal access tokens. Do you want to add a token?')) {
        askGithubToken(function () {
          userNowKnowsAboutGithubTokenFeature(function () {})
        })
      } else {
        userNowKnowsAboutGithubTokenFeature(function () {
          alert('You can click extension icon to set a token.')
        })
      }
    }
  })
}

function askGithubToken (cb) {
  const githubToken = prompt('Please enter your Github token')

  if (githubToken) {
    setGithubToken(githubToken, cb)
  } else {
    alert('You have entered an empty token.')

    cb()
  }
}

chrome.browserAction.onClicked.addListener(function (tab) {
  handleOldGithubToken(function (askToSetToken) {
    if (askToSetToken) {
      askGithubToken(function () {})
    }
  })
})

informUserAboutGithubTokenFeature()
