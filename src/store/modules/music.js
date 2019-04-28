import { getPlaylists, getPlaylist, getMusicUrl } from '@/api/music.js'

const music = {
  state: {
    backendInfo: {
      domain: '',
      uid: ''
    },
    playlists: [],
    playlistsStatus: '',
    playlist: [],
    playlistStatus: '',
    idToPlaylist: new Map()
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
      state.backendInfo.domain = newValue.domain
      state.backendInfo.uid = newValue.uid
    }
  },

  actions: {
    GetPlaylists(store) {
      return new Promise((resolve, reject) => {
        store.commit('setPlaylistsStatus', 'loading')
        getPlaylists(store.state.backendInfo.domain, store.state.backendInfo.uid).then(response => {
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
          getPlaylist(store.state.backendInfo.domain, id).then(response => {
            const idToMusic = new Map()
            response.data.playlist.tracks.forEach(item => {
              idToMusic.set(item.id, {
                name: item.name,
                artist: item.ar[0].name,
                cover: item.al.picUrl
              })
            })
            getMusicUrl(store.state.backendInfo.domain, Array.from(idToMusic.keys()).join(',')).then(musicUrls => {
              musicUrls.data.data.forEach(item => {
                idToMusic.get(item.id).url = item.url
              })
              const list = Array.from(idToMusic.values())
              store.state.idToPlaylist.set(id, list)
              if (list.length > 0) {
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
    }
  }
}

export default music
