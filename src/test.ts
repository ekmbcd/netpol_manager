export default [
  {
    name: "1-ingress-blocked",
    namespace: "default",
    uid: "5197e1ae-b007-4d54-8ff4-495b1352f359",
    labels: { ingress: "block", pod: "1", app: "nginx" },
    ownerReferences: [
      {
        kind: "ReplicaSet",
        name: "netpol-controller-7696d99fff",
        uid: "9fa96c15-2fbd-4368-8b52-8ef56b437f39",
      },
    ],
    ingress: [],
  },
  {
    name: "2-single-ingress",
    namespace: "default",
    uid: "aee27bf3-fc69-4824-934f-banana",
    labels: { app: "nginx", pod: "2" },
    ingress: [
      {
        name: "1-ingress-blocked",
        namespace: "default",
        uid: "5197e1ae-b007-4d54-8ff4-495b1352f359",
        ports: [{ protocol: "TCP", port: 6379 }],
      },
    ],
  },
  {
    name: "3-multiple-ingress",
    namespace: "default",
    uid: "aee27bf3-fc69-4824-934f-lucertola",
    labels: { app: "nginx", test: "test-label", pod: "3" },
    ingress: [
      {
        name: "5-external-pod",
        namespace: "test-ns",
        uid: "aee27bf3-fc69-4824-934f-pomodoro",
        ports: [
          { protocol: "UDP", port: 6379 },
          { protocol: "TCP", port: 6380 },
        ],
      },
      {
        name: "1-ingress-blocked",
        namespace: "default",
        uid: "5197e1ae-b007-4d54-8ff4-495b1352f359",
        ports: [
          { protocol: "UDP", port: 6379 },
          { protocol: "TCP", port: 6380 },
        ],
      },
      {
        name: "2-single-ingress",
        namespace: "default",
        uid: "aee27bf3-fc69-4824-934f-banana",
        ports: [
          { protocol: "UDP", port: 6379 },
          { protocol: "TCP", port: 6380 },
        ],
      },
      {
        name: "4-nginx4",
        namespace: "default",
        uid: "aee27bf3-fc69-4824-934f-elefante",
        ports: [
          { protocol: "UDP", port: 6379 },
          { protocol: "TCP", port: 6380 },
        ],
      },
    ],
  },
  {
    name: "4-egress-blocked",
    namespace: "default",
    uid: "aee27bf3-fc69-4824-934f-elefante",
    labels: { app: "nginx", pod: "4" },
    egress: [],
  },
  {
    name: "5-external-pod",
    namespace: "test-ns",
    uid: "aee27bf3-fc69-4824-934f-pomodoro",
    labels: { app: "nginx", test: "test-label", pod: "5" },
  },
  {
    name: "6-external-pod-no-labels",
    namespace: "test-ns",
    uid: "aee27bf3-fc69-4824-934f-anguria",
    labels: {},
    egress: [
      {
        name: "2-single-ingress",
        namespace: "default",
        uid: "aee27bf3-fc69-4824-934f-banana",
        ports: [
          { protocol: "UDP", port: 6379 },
          { protocol: "TCP", port: 6380 },
        ],
      },
    ],
  },
  {
    name: "7-external-pod-single-ingress-single-egress",
    namespace: "test-ns-2",
    uid: "aee27bf3-fc69-4824-934f-cetriolo",
    labels: {},
    ingress: [
      {
        name: "1-ingress-blocked",
        namespace: "default",
        uid: "5197e1ae-b007-4d54-8ff4-495b1352f359",
        ports: [{ protocol: "TCP", port: 6379 }],
      },
    ],
    egress: [
      {
        name: "5-external-pod",
        namespace: "default",
        uid: "aee27bf3-fc69-4824-934f-pomodoro",
        ports: [{ protocol: "TCP", port: 6379 }],
      },
    ],
  },
];
