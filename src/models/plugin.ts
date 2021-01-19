import * as services from "@/services/plugin";

export default {
  namespace: "plugin",
  state: {
    list: null
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *searchPlugins({ payload: where }: any, { call, put, select }: any) {
      const { data } = yield call(services.searchPlugin, where);
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
  subscriptions: {}
};
