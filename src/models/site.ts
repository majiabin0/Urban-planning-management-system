import * as services from "@/services/site";

export default {
  namespace: "site",
  state: {
    sites: null,
    list: null
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *getSites({ payload: params }: any, { call, put, select }: any) {
      const { data } = yield call(services.getSites);
      if (data.list) {
        yield put({
          type: "save",
          payload: {
            sites: data.list
          }
        });
      }
    },

    *searchSites({ payload: where }: any, { call, put, select }: any) {
      const { data } = yield call(services.searchSites, where);
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
