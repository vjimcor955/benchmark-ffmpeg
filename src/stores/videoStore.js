import { defineStore } from 'pinia'

export const useVideoStore = defineStore('videoStore', {
  state: () => ({
    resultsList: [],
  }),
  actions: {
    setResults(videoInfo) {
      this.resultsList.push(videoInfo);
    },
    getResults() {
      return this.resultsList;
    },
  },
})

export default useVideoStore