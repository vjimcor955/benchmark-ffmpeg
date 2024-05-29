import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../layouts/LayoutRoot.vue"),
    children: [
      { 
        path: '', 
        name: 'root-home', 
        component: () => import('../views/HomeView.vue'), 
      },
      { 
        path: '/login', 
        name: 'login',
        component: () => import('../views/LoginView.vue') 
      },
    ]
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../layouts/LayoutPrivate.vue"),
    children: [
      { 
        path: '', 
        name: 'private-user',
        component: () => import('../views/UserView.vue') 
      },
      { 
        path: '/convert-video', 
        name: 'convert-video',
        component: () => import('../views/ConvertVideoView.vue') 
      },
      { 
        path: '/results', 
        name: 'results',
        component: () => import('../views/ResultsView.vue') 
      },
      { 
        path: '/video-player', 
        name: 'video-player',
        component: () => import('../views/VideoPlayerView.vue') 
      },
    ],
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found',
    component: () => import('../views/NotFound404View.vue') 
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes  
})

export default router
