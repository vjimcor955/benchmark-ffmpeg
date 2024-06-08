import { defineStore } from 'pinia'

export const useVideoStore = defineStore('videoStore', {
  state: () => ({
    videoId: null,
    resultsList: [],
  }),
  actions: {
    setVideoId(id) {
      this.videoId = id;
    },
    setResults(videoInfo) {
      this.resultsList.push(videoInfo);
    },
    getResults() {
      return this.resultsList;
    },
    resetResults() {
      this.resultsList = [];
      this.videoId = null;
    }
  },
})

export default useVideoStore