export default [
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {path: '/user', redirect: '/user/login'},
          {path: '/user/login', name: 'login', component: './User/Login'},
        //   {path: '/user/register', name: 'register', component: './User/Register'},
        //   {path: '/user/forget-password', name: 'forgetPassword', component: './User/ForgetPassword'},
        //   {path: '/user/new-password', name: 'setNewPassword', component: './User/SetNewPassword'},
        //   {
        //     path: '/user/register-result',
        //     name: 'register.result',
        //     component: './User/RegisterResult',
        //   },
        //   {
        //     component: '404',
        //   },
        ],
    },
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
        {
            path: '/',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
        },
        {
            path:'/test',
            name:'testPage',
            icon:'smile',
            component:'./TestPage'
        },
        {
            component: './404',
        },
        ],  
    },
    {
        path: '/404',
        component: './404',
    },
]