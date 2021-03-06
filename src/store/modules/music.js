import { getPlaylists, getPlaylist, getMusicUrl } from '@/api/music.js'

const music = {
  state: {
    backendInfo: {
      uid: ''
    },
    playlists: [],
    playlistsStatus: '',
    playlist: [],
    playlistStatus: '',
    idToPlaylist: new Map(),
    currentId: undefined
  },

  mutations: {
    setPlaylists(state, newValue) {
      state.playlists = newValue
    },
    setPlaylistsStatus(state, newValue) {
      state.playlistsStatus = newValue
    },
    setPlaylist(state, newValue) {
      state.playlist = newValue
    },
    setPlaylistStatus(state, newValue) {
      state.playlistStatus = newValue
    },
    setBackendInfo(state, newValue) {
      state.backendInfo.uid = newValue.uid
    },
    setCurrentId(state, newValue) {
      state.currentId = newValue
    }
  },

  actions: {
    GetPlaylists(store) {
      return new Promise((resolve, reject) => {
        store.commit('setPlaylistsStatus', 'loading')
        getPlaylists(store.state.backendInfo.uid).then(response => {
          store.commit('setPlaylistsStatus', 'ready')
          resolve(response)
        }).catch(error => {
          store.commit('setPlaylistsStatus', 'error')
          reject(error)
        })
      })
    },
    GetPlaylist(store, id) {
      return new Promise((resolve, reject) => {
        store.commit('setPlaylistStatus', 'loading')
        if (store.state.idToPlaylist.has(id)) {
          store.commit('setPlaylistStatus', 'ready')
          resolve(store.state.idToPlaylist.get(id).slice())
        } else {
          getPlaylist(id).then(response => {
            const idToMusic = new Map()
            response.data.playlist.tracks.forEach(item => {
              idToMusic.set(item.id, {
                name: item.name,
                artist: item.ar[0].name,
                cover: item.al.picUrl
              })
            })
            getMusicUrl(Array.from(idToMusic.keys()).join(',')).then(musicUrls => {
              musicUrls.data.data.forEach(item => {
                if (item.url) {
                  idToMusic.get(item.id).url = item.url
                } else {
                  // 移除没有版本/会员的歌曲
                  idToMusic.delete(item.id)
                }
              })
              const list = Array.from(idToMusic.values())
              if (list.length > 0) {
                store.state.idToPlaylist.set(id, list)
                store.commit('setPlaylistStatus', 'ready')
                resolve(list.slice())
              } else {
                store.commit('setPlaylistStatus', 'error')
                reject('当前歌单没有音乐')
              }
            }).catch(musicError => {
              store.commit('setPlaylistStatus', 'error')
              reject(musicError)
            })
          }).catch(error => {
            store.commit('setPlaylistStatus', 'error')
            reject(error)
          })
        }
      })
    },
    SwitchPlayList(store, id) {
      return new Promise((resolve, reject) => {
        store.dispatch('GetPlaylist', id).then(list => {
          store.commit('setPlaylist', list)
          store.commit('setCurrentId', id)
          resolve(list)
        }).catch(error => {
          reject(error)
        })
      })
    },
    ResetPlaylist(store) {
      return new Promise((resolve, reject) => {
        if (store.state.currentId) {
          store.state.idToPlaylist.delete(store.state.currentId)
          store.dispatch('SwitchPlayList', store.state.currentId).then(list => {
            resolve(list)
          }).catch(error => {
            reject(error)
          })
        }
      })
    }
  }
}

export default music
