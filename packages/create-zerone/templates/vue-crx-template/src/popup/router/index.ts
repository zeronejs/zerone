import { createMemoryHistory, createRouter } from 'vue-router';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', name: 'popup-noop', component: { render: () => null } }],
});

export default router;
