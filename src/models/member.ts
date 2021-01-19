import * as services from "@/services/member";

export default {
    namespace: "member",
    state: {
        member: null,
        list: null,
        role:null,
    },
    reducers: {
        save(state: any, { payload }: any) {
            return { ...state, ...payload };
        }
    },
    effects: {
        *getAdmin({ payload: params }: any, { call, put, select }: any) {
            const { data } = yield call(services.searchAdmin);
            if (data.list) {
                yield put({
                    type: "save",
                    payload: {
                        member: data.list
                    }
                });
            }
        },

        *getRole({ payload: where }: any, { call, put, select }: any) {
            const { data } = yield call(services.getRole, where);
            if (data) {
                yield put({
                    type: "save",
                    payload: {
                        role: data
                    }
                });
            }
        },
        *searchAdmin({ payload: where }: any, { call, put, select }: any) {
            const { data } = yield call(services.searchAdmin, where);
            if (data) {
                yield put({
                    type: "save",
                    payload: {
                        list: data
                    }
                });
            }
        }
    },
    subscriptions: {
        // 这个写法会造成所有content的路由都去请求全部站点信息
        // 没必要请求这么多次
        // 2020-12-12 标注
        // setup({ dispatch, history }: any) {
        //   return history.listen(({ pathname }: any) => {
        //     if (pathname.indexOf("/content") === 0) {
        //       dispatch({
        //         type: "getSites"
        //       });
        //     }
        //   });
        // }
    }
};
