import * as services from "@/services/article";

export default {
  namespace: "article",
  state: {
    list: null,
    articleDetail: null
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *getArticles({ payload: where }: any, { call, put, select }: any) {
      const { data } = yield call(services.getArticles, where);
      if (data) {
        yield put({
          type: "save",
          payload: {
            list: data
          }
        });
      }
    },

    *getDetail({ payload: { id } }: any, { call, put, select }: any) {
      const { data } = yield call(services.getDetail, { id });
      yield put({
        type: "save",
        payload: {
          articleDetail: data.article
        }
      });
    }
  },
  subscriptions: {}
};
